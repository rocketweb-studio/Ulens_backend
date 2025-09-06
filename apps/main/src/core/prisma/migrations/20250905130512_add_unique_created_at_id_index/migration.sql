/*
  Warnings:

  - A unique constraint covering the columns `[createdAt,id]` on the table `posts` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "posts_createdAt_id_key" ON "public"."posts"("createdAt", "id");
