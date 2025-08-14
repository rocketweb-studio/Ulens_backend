/*
  Warnings:

  - You are about to drop the `posts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."posts" DROP CONSTRAINT "posts_author_id_fkey";

-- DropTable
DROP TABLE "public"."posts";

-- DropTable
DROP TABLE "public"."users";

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "userName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "passwordHash" TEXT,
    "passwordSalt" TEXT,
    "confirmationCode" TEXT,
    "confCodeConfirmed" BOOLEAN NOT NULL,
    "recoveryCode" TEXT,
    "recCodeConfirmed" BOOLEAN,
    "confCodeExpDate" TIMESTAMP(3),
    "recCodeExpDate" TIMESTAMP(3),
    "googleUserId" TEXT,
    "gitHubUserId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Session" (
    "deviceId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "deviceName" TEXT NOT NULL,
    "iat" TIMESTAMP(3) NOT NULL,
    "exp" TIMESTAMP(3) NOT NULL,
    "ip" TEXT NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("deviceId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userName_key" ON "public"."User"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_confirmationCode_key" ON "public"."User"("confirmationCode");

-- CreateIndex
CREATE UNIQUE INDEX "User_recoveryCode_key" ON "public"."User"("recoveryCode");

-- CreateIndex
CREATE UNIQUE INDEX "User_googleUserId_key" ON "public"."User"("googleUserId");

-- CreateIndex
CREATE UNIQUE INDEX "User_gitHubUserId_key" ON "public"."User"("gitHubUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_deviceId_key" ON "public"."Session"("deviceId");

-- AddForeignKey
ALTER TABLE "public"."Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
