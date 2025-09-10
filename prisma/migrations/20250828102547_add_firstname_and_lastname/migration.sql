-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "selectedTier" TEXT,
ALTER COLUMN "age" DROP NOT NULL,
ALTER COLUMN "heightCm" DROP NOT NULL,
ALTER COLUMN "weightKg" DROP NOT NULL;
