import { PrismaClient } from "@prisma/client";
type StatutCommande = "EN_COURS" | "LIVREE";


const prisma = new PrismaClient();

async function main() {
  await prisma.client.createMany({
    data: [
      { nom: "Client A", email: "clientA@test.com" },
      { nom: "Client B", email: "clientB@test.com" }
    ]
  });

  await prisma.produit.createMany({
    data: [
      { nom: "Produit 1", prix: 10, stock: 100, categorie: "Cat 1" },
      { nom: "Produit 2", prix: 20, stock: 50, categorie: "Cat 2" }
    ]
  });

  const client = await prisma.client.findFirst();
  const produit = await prisma.produit.findFirst();
  if (client && produit) {
    const commande = await prisma.commande.create({
      data: {
        idClient: client.id,
        statut: "EN_COURS"
      }
    });
    await prisma.ligneCommande.create({
      data: {
        idCommande: commande.id,
        idProduit: produit.id,
        quantite: 2
      }
    });
  }
}

main().finally(() => prisma.$disconnect());
