-- CreateTable
CREATE TABLE "public"."Likes" (
    "id" SERIAL NOT NULL,
    "clientId" INTEGER NOT NULL,
    "applicantId" INTEGER NOT NULL,

    CONSTRAINT "Likes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Likes_clientId_idx" ON "public"."Likes"("clientId");

-- CreateIndex
CREATE INDEX "Likes_applicantId_idx" ON "public"."Likes"("applicantId");

-- CreateIndex
CREATE UNIQUE INDEX "Likes_clientId_applicantId_key" ON "public"."Likes"("clientId", "applicantId");

-- AddForeignKey
ALTER TABLE "public"."Likes" ADD CONSTRAINT "Likes_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Likes" ADD CONSTRAINT "Likes_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
