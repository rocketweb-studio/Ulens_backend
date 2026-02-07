/*
  Warnings:

  - You are about to drop the `message_audios` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `message_images` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."MessageMediaType" AS ENUM ('IMAGE', 'AUDIO');

-- DropTable
DROP TABLE "public"."message_audios";

-- DropTable
DROP TABLE "public"."message_images";

-- CreateTable
CREATE TABLE "public"."message_attachments" (
    "id" TEXT NOT NULL,
    "messageId" INTEGER,
    "roomId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "fileSize" INTEGER,
    "size" "public"."sizes",
    "type" "public"."MessageMediaType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "message_attachments_pkey" PRIMARY KEY ("id")
);
