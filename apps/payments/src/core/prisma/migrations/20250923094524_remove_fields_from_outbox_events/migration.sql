/*
  Warnings:

  - You are about to drop the column `aggregateId` on the `outbox_events` table. All the data in the column will be lost.
  - You are about to drop the column `correlationId` on the `outbox_events` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."outbox_events" DROP COLUMN "aggregateId",
DROP COLUMN "correlationId";
