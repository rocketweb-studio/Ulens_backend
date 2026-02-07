/*
  Warnings:

  - The `messageId` column on the `message_images` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."message_images" DROP COLUMN "messageId",
ADD COLUMN     "messageId" INTEGER;
