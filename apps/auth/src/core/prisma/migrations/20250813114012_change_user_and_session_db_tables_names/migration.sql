/*
  Warnings:

  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropTable
DROP TABLE "public"."Session";

-- DropTable
DROP TABLE "public"."User";

-- CreateTable
CREATE TABLE "public"."users" (
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

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sessions" (
    "deviceId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "deviceName" TEXT NOT NULL,
    "iat" TIMESTAMP(3) NOT NULL,
    "exp" TIMESTAMP(3) NOT NULL,
    "ip" TEXT NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("deviceId")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_userName_key" ON "public"."users"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_confirmationCode_key" ON "public"."users"("confirmationCode");

-- CreateIndex
CREATE UNIQUE INDEX "users_recoveryCode_key" ON "public"."users"("recoveryCode");

-- CreateIndex
CREATE UNIQUE INDEX "users_googleUserId_key" ON "public"."users"("googleUserId");

-- CreateIndex
CREATE UNIQUE INDEX "users_gitHubUserId_key" ON "public"."users"("gitHubUserId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_deviceId_key" ON "public"."sessions"("deviceId");

-- AddForeignKey
ALTER TABLE "public"."sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
