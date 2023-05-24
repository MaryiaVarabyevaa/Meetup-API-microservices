/*
  Warnings:

  - You are about to drop the column `place` on the `Meetup` table. All the data in the column will be lost.
  - Added the required column `city` to the `Meetup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Meetup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `houseNumber` to the `Meetup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `Meetup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Meetup" DROP COLUMN "place",
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "houseNumber" TEXT NOT NULL,
ADD COLUMN     "street" TEXT NOT NULL;
