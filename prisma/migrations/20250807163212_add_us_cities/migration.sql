-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."City" ADD VALUE 'NEW_YORK';
ALTER TYPE "public"."City" ADD VALUE 'LOS_ANGELES';
ALTER TYPE "public"."City" ADD VALUE 'CHICAGO';
ALTER TYPE "public"."City" ADD VALUE 'HOUSTON';
ALTER TYPE "public"."City" ADD VALUE 'PHOENIX';
ALTER TYPE "public"."City" ADD VALUE 'PHILADELPHIA';
ALTER TYPE "public"."City" ADD VALUE 'SAN_ANTONIO';
ALTER TYPE "public"."City" ADD VALUE 'SAN_DIEGO';
ALTER TYPE "public"."City" ADD VALUE 'DALLAS';
ALTER TYPE "public"."City" ADD VALUE 'SAN_JOSE';
