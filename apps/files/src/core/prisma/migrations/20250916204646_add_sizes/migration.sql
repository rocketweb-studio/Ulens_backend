/*
  Warnings:

  - Added the required column `size` to the `avatars` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."sizes" AS ENUM ('small', 'medium', 'large');

-- AlterTable
ALTER TABLE "public"."avatars" ADD COLUMN     "size" "public"."sizes" NOT NULL;

-- AlterTable
ALTER TABLE "public"."posts" ADD COLUMN     "size" "public"."sizes" NOT NULL;
