/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Place` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "_CategoryToPlace" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_CategoryToPlace_A_fkey" FOREIGN KEY ("A") REFERENCES "Category" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CategoryToPlace_B_fkey" FOREIGN KEY ("B") REFERENCES "Place" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Place" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "coordinates" JSONB
);
INSERT INTO "new_Place" ("address", "coordinates", "description", "id", "name", "rating") SELECT "address", "coordinates", "description", "id", "name", "rating" FROM "Place";
DROP TABLE "Place";
ALTER TABLE "new_Place" RENAME TO "Place";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToPlace_AB_unique" ON "_CategoryToPlace"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToPlace_B_index" ON "_CategoryToPlace"("B");
