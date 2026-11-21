/**
 * One-off fix for the duplicate-user bug: email encryption used a random IV,
 * so the login upsert (match by encrypted email) never found existing users
 * and kept creating new ones.
 *
 * For every email (decrypted), this script:
 *   1. Picks the oldest user as canonical.
 *   2. Moves every duplicate's translations to the canonical user.
 *   3. Deletes the duplicates.
 *   4. Re-encrypts the canonical user's email with the new deterministic
 *      scheme, so the very next login matches it (no new duplicate created).
 *
 * Usage:
 *   npx tsx scripts/fix-duplicate-users.ts            # dry run, no writes
 *   npx tsx scripts/fix-duplicate-users.ts --apply     # applies the changes
 */
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import CryptoJS from "crypto-js";

const APPLY = process.argv.includes("--apply");

function getEncryptionKey() {
  return CryptoJS.enc.Hex.parse(process.env.ENCRYPTION_KEY as string);
}

const legacyIv = CryptoJS.lib.WordArray.create(new Uint8Array(16));

function decrypt(payload: string): string {
  const hasIvPrefix = payload.charAt(32) === ":";
  const iv = hasIvPrefix ? CryptoJS.enc.Hex.parse(payload.slice(0, 32)) : legacyIv;
  const ciphertext = hasIvPrefix ? payload.slice(33) : payload;
  const bytes = CryptoJS.AES.decrypt(ciphertext, getEncryptionKey(), { iv });
  return bytes.toString(CryptoJS.enc.Utf8);
}

function deterministicIv(text: string): CryptoJS.lib.WordArray {
  const hmac = CryptoJS.HmacSHA256(text, getEncryptionKey());
  hmac.sigBytes = 16;
  hmac.clamp();
  return hmac;
}

function encryptDeterministic(text: string): string {
  const iv = deterministicIv(text);
  const ciphertext = CryptoJS.AES.encrypt(text, getEncryptionKey(), { iv }).toString();
  return `${iv.toString(CryptoJS.enc.Hex)}:${ciphertext}`;
}

const connectionString = process.env.DATABASE_DIRECT_URL ?? process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  if (!process.env.ENCRYPTION_KEY) {
    throw new Error("ENCRYPTION_KEY não está definido no ambiente.");
  }

  const users = await prisma.user.findMany({
    include: { _count: { select: { translations: true } } },
    orderBy: { created_at: "asc" },
  });

  const byEmail = new Map<string, typeof users>();
  for (const user of users) {
    let plainEmail: string;
    try {
      plainEmail = decrypt(user.email);
    } catch {
      plainEmail = "";
    }
    if (!plainEmail) {
      console.warn(`[skip] usuário ${user.id}: não foi possível descriptografar o email, pulando.`);
      continue;
    }
    const list = byEmail.get(plainEmail) ?? [];
    list.push(user);
    byEmail.set(plainEmail, list);
  }

  let groupsWithDuplicates = 0;
  let duplicateUsersRemoved = 0;
  let translationsMoved = 0;
  let emailsReencrypted = 0;

  for (const [email, group] of byEmail) {
    const [canonical, ...duplicates] = group; // already ordered by created_at asc

    if (duplicates.length > 0) {
      groupsWithDuplicates++;
      duplicateUsersRemoved += duplicates.length;

      console.log(`\nEmail: ${email}`);
      console.log(
        `  mantém: ${canonical.id} (criado ${canonical.created_at.toISOString()}, ${canonical._count.translations} traduções)`
      );
      for (const dup of duplicates) {
        console.log(
          `  remove: ${dup.id} (criado ${dup.created_at.toISOString()}, ${dup._count.translations} traduções) -> traduções vão para ${canonical.id}`
        );
        translationsMoved += dup._count.translations;
      }
    }

    const newEmail = encryptDeterministic(email);
    const needsReencrypt = canonical.email !== newEmail;
    if (needsReencrypt) emailsReencrypted++;

    if (!APPLY) continue;

    const duplicateIds = duplicates.map((d) => d.id);
    await prisma.$transaction([
      ...(duplicateIds.length > 0
        ? [
            prisma.translation.updateMany({
              where: { author_id: { in: duplicateIds } },
              data: { author_id: canonical.id },
            }),
            prisma.user.deleteMany({ where: { id: { in: duplicateIds } } }),
          ]
        : []),
      ...(needsReencrypt
        ? [prisma.user.update({ where: { id: canonical.id }, data: { email: newEmail } })]
        : []),
    ]);
  }

  console.log(`\n${APPLY ? "" : "[DRY RUN] "}Grupos com duplicados: ${groupsWithDuplicates}`);
  console.log(`${APPLY ? "" : "[DRY RUN] "}Usuários duplicados removidos: ${duplicateUsersRemoved}`);
  console.log(`${APPLY ? "" : "[DRY RUN] "}Traduções movidas: ${translationsMoved}`);
  console.log(`${APPLY ? "" : "[DRY RUN] "}Emails migrados para o novo formato determinístico: ${emailsReencrypted}`);

  if (!APPLY) {
    console.log("\nNenhuma alteração foi feita. Revise a lista acima e rode de novo com --apply.");
  } else {
    console.log("\nAlterações aplicadas.");
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
