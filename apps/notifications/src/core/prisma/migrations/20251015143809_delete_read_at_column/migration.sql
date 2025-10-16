/*
  Warnings:

  - You are about to drop the column `sentAt` on the `notifications` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."notifications" DROP COLUMN "sentAt";
