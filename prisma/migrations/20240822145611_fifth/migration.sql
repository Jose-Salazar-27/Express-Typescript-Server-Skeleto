/*
  Warnings:

  - You are about to alter the column `Exp` on the `DiscordUser` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "DiscordUser" ALTER COLUMN "Exp" SET DATA TYPE INTEGER;
