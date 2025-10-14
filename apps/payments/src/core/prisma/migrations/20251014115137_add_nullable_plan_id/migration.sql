-- DropForeignKey
ALTER TABLE "public"."transactions" DROP CONSTRAINT "transactions_planId_fkey";

-- AlterTable
ALTER TABLE "public"."transactions" ALTER COLUMN "planId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."transactions" ADD CONSTRAINT "transactions_planId_fkey" FOREIGN KEY ("planId") REFERENCES "public"."plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;
