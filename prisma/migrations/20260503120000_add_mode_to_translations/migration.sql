-- Adiciona coluna nullable para não quebrar registros existentes
ALTER TABLE "translations" ADD COLUMN "mode" TEXT;

-- Preenche registros existentes com o modo padrão
UPDATE "translations" SET "mode" = 'encode' WHERE "mode" IS NULL;

-- Aplica a constraint NOT NULL
ALTER TABLE "translations" ALTER COLUMN "mode" SET NOT NULL;
