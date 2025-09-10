/*
  Warnings:

  - A unique constraint covering the columns `[tier]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Subscription_tier_key" ON "public"."Subscription"("tier");
