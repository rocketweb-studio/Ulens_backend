/*
  Warnings:

  - Made the column `updatedAt` on table `posts` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."posts" ALTER COLUMN "updatedAt" SET NOT NULL;
