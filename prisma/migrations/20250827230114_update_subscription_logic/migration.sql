/*
  Warnings:

  - You are about to drop the column `currentPeriodEnd` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `currentPeriodStart` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `stripeCustomerId` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `stripeSubscriptionId` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `tierId` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `activatedAt` on the `SubscriptionFeature` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `SubscriptionFeature` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `SubscriptionFeature` table. All the data in the column will be lost.
  - You are about to drop the `TierFeature` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `tier` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."TierEnum" AS ENUM ('BRONZE', 'SILVER', 'GOLD', 'ELITEVIP');

-- DropForeignKey
ALTER TABLE "public"."Subscription" DROP CONSTRAINT "Subscription_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TierFeature" DROP CONSTRAINT "TierFeature_featureId_fkey";

-- DropIndex
DROP INDEX "public"."Subscription_stripeCustomerId_idx";

-- DropIndex
DROP INDEX "public"."Subscription_stripeSubscriptionId_idx";

-- DropIndex
DROP INDEX "public"."Subscription_userId_idx";

-- AlterTable
ALTER TABLE "public"."Subscription" DROP COLUMN "currentPeriodEnd",
DROP COLUMN "currentPeriodStart",
DROP COLUMN "status",
DROP COLUMN "stripeCustomerId",
DROP COLUMN "stripeSubscriptionId",
DROP COLUMN "tierId",
DROP COLUMN "userId",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tier" "public"."TierEnum" NOT NULL;

-- AlterTable
ALTER TABLE "public"."SubscriptionFeature" DROP COLUMN "activatedAt",
DROP COLUMN "expiresAt",
DROP COLUMN "isActive";

-- DropTable
DROP TABLE "public"."TierFeature";

-- CreateTable
CREATE TABLE "public"."UserSubscription" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "subscriptionId" INTEGER NOT NULL,
    "stripeCustomerId" TEXT NOT NULL,
    "stripeSubscriptionId" TEXT,
    "status" "public"."SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "currentPeriodStart" TIMESTAMP(3) NOT NULL,
    "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserSubscription_userId_idx" ON "public"."UserSubscription"("userId");

-- CreateIndex
CREATE INDEX "UserSubscription_subscriptionId_idx" ON "public"."UserSubscription"("subscriptionId");

-- AddForeignKey
ALTER TABLE "public"."UserSubscription" ADD CONSTRAINT "UserSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserSubscription" ADD CONSTRAINT "UserSubscription_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "public"."Subscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
