/*
  Warnings:

  - You are about to drop the column `address` on the `Place` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Place" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "coordinates" JSONB
);
INSERT INTO "new_Place" ("coordinates", "description", "id", "name", "rating") SELECT "coordinates", "description", "id", "name", "rating" FROM "Place";
DROP TABLE "Place";
ALTER TABLE "new_Place" RENAME TO "Place";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
