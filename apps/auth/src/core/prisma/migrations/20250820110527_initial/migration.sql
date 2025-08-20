-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "passwordHash" TEXT NOT NULL,
    "confirmationCode" TEXT,
    "confirmationCodeConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "confirmationCodeExpDate" TIMESTAMP(3),
    "recoveryCode" TEXT,
    "recoveryCodeExpDate" TIMESTAMP(3),
    "googleUserId" TEXT,
    "gitHubUserId" TEXT,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sessions" (
    "deviceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "deviceName" TEXT NOT NULL,
    "iat" TIMESTAMP(3) NOT NULL,
    "exp" TIMESTAMP(3) NOT NULL,
    "ip" TEXT NOT NULL,
    "country" TEXT,
    "city" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "timezone" TEXT,
    "browser" TEXT,
    "os" TEXT,
    "type" TEXT,
    "userAgent" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("deviceId")
);

-- CreateTable
CREATE TABLE "public"."blacklist" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiredAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blacklist_pkey" PRIMARY KEY ("id")
);

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
