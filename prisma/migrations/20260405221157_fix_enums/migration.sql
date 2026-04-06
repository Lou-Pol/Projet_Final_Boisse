-- CreateTable
CREATE TABLE "UtilisateurLocal" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "idJsonPlaceholder" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "motDePasseHash" TEXT NOT NULL,
    "role" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Client" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Produit" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "prix" REAL NOT NULL,
    "stock" INTEGER NOT NULL,
    "categorie" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Commande" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "idClient" INTEGER NOT NULL,
    "statut" TEXT NOT NULL,
    CONSTRAINT "Commande_idClient_fkey" FOREIGN KEY ("idClient") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LigneCommande" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "idCommande" INTEGER NOT NULL,
    "idProduit" INTEGER NOT NULL,
    "quantite" INTEGER NOT NULL,
    CONSTRAINT "LigneCommande_idCommande_fkey" FOREIGN KEY ("idCommande") REFERENCES "Commande" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LigneCommande_idProduit_fkey" FOREIGN KEY ("idProduit") REFERENCES "Produit" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "UtilisateurLocal_idJsonPlaceholder_key" ON "UtilisateurLocal"("idJsonPlaceholder");

-- CreateIndex
CREATE UNIQUE INDEX "UtilisateurLocal_email_key" ON "UtilisateurLocal"("email");
