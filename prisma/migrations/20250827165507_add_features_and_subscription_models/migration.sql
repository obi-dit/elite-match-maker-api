-- CreateEnum
CREATE TYPE "public"."FeatureCategory" AS ENUM ('CONTENT', 'COMMUNITY', 'INTERACTION', 'MATCHMAKING', 'CONCIERGE', 'VERIFICATION', 'MEDIA', 'OTHER');

-- CreateTable
CREATE TABLE "public"."Feature" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" "public"."FeatureCategory" NOT NULL DEFAULT 'CONTENT',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Feature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TierFeature" (
    "id" SERIAL NOT NULL,
    "tierId" TEXT NOT NULL,
    "featureId" INTEGER NOT NULL,
    "isIncluded" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TierFeature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SubscriptionFeature" (
    "id" SERIAL NOT NULL,
    "subscriptionId" INTEGER NOT NULL,
    "featureId" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "activatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubscriptionFeature_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Feature_name_key" ON "public"."Feature"("name");

-- CreateIndex
CREATE INDEX "Feature_category_idx" ON "public"."Feature"("category");

-- CreateIndex
CREATE INDEX "TierFeature_tierId_idx" ON "public"."TierFeature"("tierId");

-- CreateIndex
CREATE INDEX "TierFeature_featureId_idx" ON "public"."TierFeature"("featureId");

-- CreateIndex
CREATE UNIQUE INDEX "TierFeature_tierId_featureId_key" ON "public"."TierFeature"("tierId", "featureId");

-- CreateIndex
CREATE INDEX "SubscriptionFeature_subscriptionId_idx" ON "public"."SubscriptionFeature"("subscriptionId");

-- CreateIndex
CREATE INDEX "SubscriptionFeature_featureId_idx" ON "public"."SubscriptionFeature"("featureId");

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionFeature_subscriptionId_featureId_key" ON "public"."SubscriptionFeature"("subscriptionId", "featureId");

-- AddForeignKey
ALTER TABLE "public"."TierFeature" ADD CONSTRAINT "TierFeature_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "public"."Feature"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SubscriptionFeature" ADD CONSTRAINT "SubscriptionFeature_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "public"."Subscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SubscriptionFeature" ADD CONSTRAINT "SubscriptionFeature_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "public"."Feature"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
