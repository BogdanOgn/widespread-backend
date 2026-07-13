-- Replace single-language "name" with bilingual "name_ru"/"name_en" on "category".
-- Existing values are copied into both columns since no translation is available yet.
ALTER TABLE "category" ADD COLUMN "name_ru" VARCHAR(100);
ALTER TABLE "category" ADD COLUMN "name_en" VARCHAR(100);

UPDATE "category" SET "name_ru" = "name", "name_en" = "name";

ALTER TABLE "category" ALTER COLUMN "name_ru" SET NOT NULL;
ALTER TABLE "category" ALTER COLUMN "name_en" SET NOT NULL;
ALTER TABLE "category" DROP COLUMN "name";
