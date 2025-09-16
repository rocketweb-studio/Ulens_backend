-- CreateEnum
CREATE TYPE "public"."transaction_statuses" AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "public"."transaction_providers" AS ENUM ('STRIPE', 'PAYPAL');

-- CreateTable
CREATE TABLE "public"."transactions" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "stripeSubscriptionId" TEXT,
    "status" "public"."transaction_statuses" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "provider" "public"."transaction_providers" NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."subscriptions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "stripeSubscriptionId" TEXT,
    "isAutoRenewal" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."plans" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "stripeProductId" TEXT NOT NULL,
    "stripePlanId" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "interval" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "plans_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."subscriptions" ADD CONSTRAINT "subscriptions_planId_fkey" FOREIGN KEY ("planId") REFERENCES "public"."plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
