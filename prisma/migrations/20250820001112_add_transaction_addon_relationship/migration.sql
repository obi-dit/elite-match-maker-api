/*
  Warnings:

  - You are about to drop the column `addOnId` on the `Transaction` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Transaction" DROP CONSTRAINT "Transaction_addOnId_fkey";

-- AlterTable
ALTER TABLE "public"."Transaction" DROP COLUMN "addOnId";

-- CreateTable
CREATE TABLE "public"."TransactionAddOn" (
    "id" SERIAL NOT NULL,
    "transactionId" INTEGER NOT NULL,
    "addOnId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unitPrice" DECIMAL(65,30) NOT NULL,
    "totalPrice" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "TransactionAddOn_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TransactionAddOn_transactionId_idx" ON "public"."TransactionAddOn"("transactionId");

-- CreateIndex
CREATE INDEX "TransactionAddOn_addOnId_idx" ON "public"."TransactionAddOn"("addOnId");

-- AddForeignKey
ALTER TABLE "public"."TransactionAddOn" ADD CONSTRAINT "TransactionAddOn_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "public"."Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TransactionAddOn" ADD CONSTRAINT "TransactionAddOn_addOnId_fkey" FOREIGN KEY ("addOnId") REFERENCES "public"."AddOn"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
