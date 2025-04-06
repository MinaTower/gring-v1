/*
  Warnings:

  - You are about to drop the `_CategoryToPlace` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `categoryId` to the `Place` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "_CategoryToPlace_B_index";

-- DropIndex
DROP INDEX "_CategoryToPlace_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_CategoryToPlace";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Place" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "coordinates" JSONB,
    "categoryId" INTEGER NOT NULL,
    CONSTRAINT "Place_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Place" ("address", "coordinates", "description", "id", "name", "rating") SELECT "address", "coordinates", "description", "id", "name", "rating" FROM "Place";
DROP TABLE "Place";
ALTER TABLE "new_Place" RENAME TO "Place";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
