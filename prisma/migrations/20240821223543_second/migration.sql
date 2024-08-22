/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `DiscordUser` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `DiscordUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DiscordUser" ADD COLUMN     "email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "DiscordUser_email_key" ON "DiscordUser"("email");
