/*
  Warnings:

  - A unique constraint covering the columns `[discordId]` on the table `DiscordUser` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DiscordUser_discordId_key" ON "DiscordUser"("discordId");
