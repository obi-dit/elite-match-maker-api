CREATE TABLE "public"."AtsSetting" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "seasonId" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AtsSetting_pkey" PRIMARY KEY ("id")
);
