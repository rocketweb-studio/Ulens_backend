/*
  Warnings:

  - Added the required column `paypalPlanId` to the `plans` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paypalProductId` to the `plans` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."plans" ADD COLUMN     "paypalPlanId" TEXT NOT NULL,
ADD COLUMN     "paypalProductId" TEXT NOT NULL;
