/*
  Warnings:

  - You are about to drop the column `motDePasseHash` on the `UtilisateurLocal` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UtilisateurLocal" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "idJsonPlaceholder" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL
);
INSERT INTO "new_UtilisateurLocal" ("email", "id", "idJsonPlaceholder", "role") SELECT "email", "id", "idJsonPlaceholder", "role" FROM "UtilisateurLocal";
DROP TABLE "UtilisateurLocal";
ALTER TABLE "new_UtilisateurLocal" RENAME TO "UtilisateurLocal";
CREATE UNIQUE INDEX "UtilisateurLocal_idJsonPlaceholder_key" ON "UtilisateurLocal"("idJsonPlaceholder");
CREATE UNIQUE INDEX "UtilisateurLocal_email_key" ON "UtilisateurLocal"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
