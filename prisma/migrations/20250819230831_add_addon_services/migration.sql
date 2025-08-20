-- CreateEnum
CREATE TYPE "public"."AddOnCategory" AS ENUM ('SERVICE', 'VERIFICATION', 'MEDIA', 'CONCIERGE', 'OTHER');

-- DropForeignKey
ALTER TABLE "public"."Transaction" DROP CONSTRAINT "Transaction_packageId_fkey";

-- AlterTable
ALTER TABLE "public"."Transaction" ADD COLUMN     "addOnId" INTEGER,
ALTER COLUMN "packageId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "public"."AddOn" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(65,30),
    "isCustomPricing" BOOLEAN NOT NULL DEFAULT false,
    "customPricingNote" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "category" "public"."AddOnCategory" NOT NULL DEFAULT 'SERVICE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AddOn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserAddOn" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "addOnId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "customPrice" DECIMAL(65,30),
    "notes" TEXT,
    "purchasedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "UserAddOn_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AddOn_name_key" ON "public"."AddOn"("name");

-- CreateIndex
CREATE INDEX "UserAddOn_userId_idx" ON "public"."UserAddOn"("userId");

-- CreateIndex
CREATE INDEX "UserAddOn_addOnId_idx" ON "public"."UserAddOn"("addOnId");

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "public"."Package"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_addOnId_fkey" FOREIGN KEY ("addOnId") REFERENCES "public"."AddOn"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserAddOn" ADD CONSTRAINT "UserAddOn_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserAddOn" ADD CONSTRAINT "UserAddOn_addOnId_fkey" FOREIGN KEY ("addOnId") REFERENCES "public"."AddOn"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
