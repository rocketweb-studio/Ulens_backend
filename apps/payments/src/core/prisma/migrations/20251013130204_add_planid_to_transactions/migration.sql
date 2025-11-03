/*
  Warnings:

  - Added the required column `planId` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."transactions" ADD COLUMN     "planId" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."transactions" ADD CONSTRAINT "transactions_planId_fkey" FOREIGN KEY ("planId") REFERENCES "public"."plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
