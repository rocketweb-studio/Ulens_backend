-- DropIndex
DROP INDEX "public"."users_googleUserId_key";

-- AlterTable
ALTER TABLE "public"."users" ALTER COLUMN "passwordHash" DROP NOT NULL;
