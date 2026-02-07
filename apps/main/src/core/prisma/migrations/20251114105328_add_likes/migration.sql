-- CreateEnum
CREATE TYPE "public"."LikedItemType" AS ENUM ('POST', 'COMMENT');

-- CreateTable
CREATE TABLE "public"."likes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "parentType" "public"."LikedItemType" NOT NULL,
    "parentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "likes_parentType_parentId_idx" ON "public"."likes"("parentType", "parentId");

-- CreateIndex
CREATE INDEX "likes_userId_idx" ON "public"."likes"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "likes_userId_parentType_parentId_key" ON "public"."likes"("userId", "parentType", "parentId");
