-- CreateEnum
CREATE TYPE "public"."PodcastStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED', 'LIVE', 'ENDED');

-- CreateEnum
CREATE TYPE "public"."PodcastType" AS ENUM ('RECORDED', 'LIVE', 'PREMIUM');

-- CreateTable
CREATE TABLE "public"."Podcast" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "audioUrl" TEXT,
    "videoUrl" TEXT,
    "thumbnailUrl" TEXT,
    "duration" INTEGER,
    "status" "public"."PodcastStatus" NOT NULL DEFAULT 'DRAFT',
    "type" "public"."PodcastType" NOT NULL DEFAULT 'RECORDED',
    "scheduledAt" TIMESTAMP(3),
    "streamKey" TEXT,
    "isLive" BOOLEAN NOT NULL DEFAULT false,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Podcast_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PodcastCategory" (
    "id" SERIAL NOT NULL,
    "podcastId" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PodcastCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PodcastAccess" (
    "id" SERIAL NOT NULL,
    "podcastId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "accessedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PodcastAccess_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Podcast_status_idx" ON "public"."Podcast"("status");

-- CreateIndex
CREATE INDEX "Podcast_type_idx" ON "public"."Podcast"("type");

-- CreateIndex
CREATE INDEX "Podcast_isLive_idx" ON "public"."Podcast"("isLive");

-- CreateIndex
CREATE INDEX "Podcast_scheduledAt_idx" ON "public"."Podcast"("scheduledAt");

-- CreateIndex
CREATE INDEX "PodcastCategory_podcastId_idx" ON "public"."PodcastCategory"("podcastId");

-- CreateIndex
CREATE INDEX "PodcastCategory_category_idx" ON "public"."PodcastCategory"("category");

-- CreateIndex
CREATE UNIQUE INDEX "PodcastCategory_podcastId_category_key" ON "public"."PodcastCategory"("podcastId", "category");

-- CreateIndex
CREATE INDEX "PodcastAccess_podcastId_idx" ON "public"."PodcastAccess"("podcastId");

-- CreateIndex
CREATE INDEX "PodcastAccess_userId_idx" ON "public"."PodcastAccess"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PodcastAccess_podcastId_userId_key" ON "public"."PodcastAccess"("podcastId", "userId");

-- AddForeignKey
ALTER TABLE "public"."PodcastCategory" ADD CONSTRAINT "PodcastCategory_podcastId_fkey" FOREIGN KEY ("podcastId") REFERENCES "public"."Podcast"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PodcastAccess" ADD CONSTRAINT "PodcastAccess_podcastId_fkey" FOREIGN KEY ("podcastId") REFERENCES "public"."Podcast"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PodcastAccess" ADD CONSTRAINT "PodcastAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
