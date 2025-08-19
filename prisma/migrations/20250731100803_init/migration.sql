-- CreateEnum
CREATE TYPE "public"."City" AS ENUM ('BARRANQUILLA', 'SANTA_MARTA', 'CARTAGENA', 'MEDELLIN', 'BOGOTA', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."EnglishProficiency" AS ENUM ('YES', 'SOMEWHAT', 'NO');

-- CreateEnum
CREATE TYPE "public"."Children" AS ENUM ('NO', 'YES_1', 'YES_2_PLUS');

-- CreateEnum
CREATE TYPE "public"."GENDER" AS ENUM ('MALE', 'FEMALE');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT,
    "age" INTEGER NOT NULL,
    "email" TEXT,
    "whatsappNumber" TEXT,
    "gender" "public"."GENDER",
    "cityOfResidence" "public"."City",
    "cityOther" TEXT,
    "englishProficiency" "public"."EnglishProficiency",
    "heightCm" INTEGER NOT NULL,
    "weightKg" INTEGER NOT NULL,
    "isSingleAndAvailable" BOOLEAN,
    "comfortableFilming" BOOLEAN,
    "traditionalWantsMarriage" BOOLEAN,
    "willingToCompete" BOOLEAN,
    "children" "public"."Children",
    "willingLieDetector" BOOLEAN,
    "consentForMedia" BOOLEAN,
    "personalityThreeWords" TEXT,
    "relationshipGoals" TEXT,
    "attractionToOlderMen" TEXT,
    "whyGoodWife" TEXT,
    "talentsOrHobbies" TEXT,
    "comfortableBikiniChallenges" BOOLEAN NOT NULL,
    "photo1" TEXT,
    "photo2" TEXT,
    "photo3" TEXT,
    "introVideo" TEXT,
    "socialMediaLinks" TEXT,
    "understandsPrivateShow" BOOLEAN NOT NULL,
    "understandsNoCompensation" BOOLEAN NOT NULL,
    "confirmsTruthful" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");
