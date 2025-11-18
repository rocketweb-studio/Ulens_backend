-- CreateTable
CREATE TABLE "public"."message_audios" (
    "id" TEXT NOT NULL,
    "roomId" INTEGER NOT NULL,
    "messageId" INTEGER,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "message_audios_pkey" PRIMARY KEY ("id")
);
