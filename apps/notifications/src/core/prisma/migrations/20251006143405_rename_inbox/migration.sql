/*
  Warnings:

  - You are about to drop the `inbox_messages` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."inbox_messages";

-- CreateTable
CREATE TABLE "public"."inbox_events" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "status" "public"."InboxStatus" NOT NULL DEFAULT 'RECEIVED',
    "error" TEXT,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),

    CONSTRAINT "inbox_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "inbox_events_status_idx" ON "public"."inbox_events"("status");

-- CreateIndex
CREATE INDEX "inbox_events_source_type_idx" ON "public"."inbox_events"("source", "type");
