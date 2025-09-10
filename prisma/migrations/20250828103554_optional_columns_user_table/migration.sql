-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "comfortableBikiniChallenges" DROP NOT NULL,
ALTER COLUMN "comfortableBikiniChallenges" SET DEFAULT false,
ALTER COLUMN "understandsPrivateShow" DROP NOT NULL,
ALTER COLUMN "understandsPrivateShow" SET DEFAULT true,
ALTER COLUMN "understandsNoCompensation" DROP NOT NULL,
ALTER COLUMN "understandsNoCompensation" SET DEFAULT true,
ALTER COLUMN "confirmsTruthful" DROP NOT NULL,
ALTER COLUMN "confirmsTruthful" SET DEFAULT true;
