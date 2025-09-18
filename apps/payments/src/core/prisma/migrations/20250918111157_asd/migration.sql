/*
  Warnings:

  - You are about to drop the column `paypalPlanId` on the `subscriptions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."subscriptions" DROP COLUMN "paypalPlanId",
ADD COLUMN     "paypalSubscriptionId" TEXT;
