/*
  Warnings:

  - You are about to drop the column `gitHubUserId` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[githubUserId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."users_gitHubUserId_key";

-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "gitHubUserId",
ADD COLUMN     "githubUserId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_githubUserId_key" ON "public"."users"("githubUserId");
