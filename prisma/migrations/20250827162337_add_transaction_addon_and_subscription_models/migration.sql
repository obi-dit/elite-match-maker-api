/*
  Warnings:

  - You are about to drop the `UserAddOn` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."SubscriptionStatus" AS ENUM ('ACTIVE', 'CANCELLED', 'PAST_DUE', 'UNPAID', 'TRIAL');

-- DropForeignKey
ALTER TABLE "public"."UserAddOn" DROP CONSTRAINT "UserAddOn_addOnId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserAddOn" DROP CONSTRAINT "UserAddOn_userId_fkey";

-- DropTable
DROP TABLE "public"."UserAddOn";

-- CreateTable
CREATE TABLE "public"."UserPackageAddOn" (
    "id" SERIAL NOT NULL,
    "userPackageId" INTEGER NOT NULL,
    "addOnId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "customPrice" DECIMAL(65,30),
    "notes" TEXT,
    "purchasedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "UserPackageAddOn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Subscription" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "tierId" TEXT NOT NULL,
    "stripeCustomerId" TEXT NOT NULL,
    "stripeSubscriptionId" TEXT,
    "status" "public"."SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "currentPeriodStart" TIMESTAMP(3) NOT NULL,
    "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserPackageAddOn_userPackageId_idx" ON "public"."UserPackageAddOn"("userPackageId");

-- CreateIndex
CREATE INDEX "UserPackageAddOn_addOnId_idx" ON "public"."UserPackageAddOn"("addOnId");

-- CreateIndex
CREATE INDEX "Subscription_userId_idx" ON "public"."Subscription"("userId");

-- CreateIndex
CREATE INDEX "Subscription_stripeCustomerId_idx" ON "public"."Subscription"("stripeCustomerId");

-- CreateIndex
CREATE INDEX "Subscription_stripeSubscriptionId_idx" ON "public"."Subscription"("stripeSubscriptionId");

-- AddForeignKey
ALTER TABLE "public"."UserPackageAddOn" ADD CONSTRAINT "UserPackageAddOn_userPackageId_fkey" FOREIGN KEY ("userPackageId") REFERENCES "public"."UserPackage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserPackageAddOn" ADD CONSTRAINT "UserPackageAddOn_addOnId_fkey" FOREIGN KEY ("addOnId") REFERENCES "public"."AddOn"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
