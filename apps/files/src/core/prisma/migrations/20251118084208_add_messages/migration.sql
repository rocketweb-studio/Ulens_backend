-- CreateTable
CREATE TABLE "public"."message_images" (
    "id" TEXT NOT NULL,
    "messageId" TEXT,
    "roomId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "size" "public"."sizes" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "message_images_pkey" PRIMARY KEY ("id")
);
