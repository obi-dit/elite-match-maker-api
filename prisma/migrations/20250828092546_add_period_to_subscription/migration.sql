-- CreateEnum
CREATE TYPE "public"."SupscriptionPeriod" AS ENUM ('MONTHLY', 'WEEKLY', 'DAILY', 'YEARLY');

-- AlterTable
ALTER TABLE "public"."Subscription" ADD COLUMN     "period" "public"."SupscriptionPeriod" NOT NULL DEFAULT 'MONTHLY';
