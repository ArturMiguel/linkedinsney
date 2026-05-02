-- Adiciona coluna nullable para não quebrar registros existentes
ALTER TABLE "translations" ADD COLUMN "model" TEXT;

-- Preenche registros existentes com o modelo atual
UPDATE "translations" SET "model" = 'gemma4:31b-cloud' WHERE "model" IS NULL;

-- Aplica a constraint NOT NULL
ALTER TABLE "translations" ALTER COLUMN "model" SET NOT NULL;
