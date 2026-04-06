import { PrismaClient } from "@prisma/client";
import { CorpsCommande } from "../types/types";

const prisma = new PrismaClient();

export const commandesService = {
  lister: () =>
    prisma.commande.findMany({
      include: { lignes: { include: { produit: true } }, client: true }
    }),

  listerParClient: (idClient: number) =>
    prisma.commande.findMany({
      where: { idClient },
      include: { lignes: { include: { produit: true } }, client: true }
    }),

  creer: async (donnees: CorpsCommande) => {
    const commande = await prisma.commande.create({
      data: {
        idClient: donnees.idClient,
        statut: donnees.statut,
        lignes: {
          create: donnees.produits.map((p) => ({
            idProduit: p.idProduit,
            quantite: p.quantite
          }))
        }
      },
      include: { lignes: { include: { produit: true } }, client: true }
    });

    // Déduire le stock
    for (const p of donnees.produits) {
      await prisma.produit.update({
        where: { id: p.idProduit },
        data: { stock: { decrement: p.quantite } }
      });
    }

    return commande;
  },

  modifier: (id: number, donnees: Partial<CorpsCommande>) => {
    const data: any = {};
    if (donnees.idClient !== undefined) data.idClient = donnees.idClient;
    if (donnees.statut !== undefined) data.statut = donnees.statut;

    return prisma.commande.update({
      where: { id },
      data,
      include: { lignes: { include: { produit: true } }, client: true }
    });
  },

  supprimer: async (id: number) => {
  // 1) Récupérer les lignes de la commande
  const lignes = await prisma.ligneCommande.findMany({
    where: { idCommande: id },
    include: { produit: true }
  });

  // 2) Réajouter le stock pour chaque produit
  for (const l of lignes) {
    await prisma.produit.update({
      where: { id: l.idProduit },
      data: { stock: { increment: l.quantite } }
    });
  }

  // 3) Supprimer les lignes
  await prisma.ligneCommande.deleteMany({
    where: { idCommande: id }
  });

  // 4) Supprimer la commande
  return prisma.commande.delete({
    where: { id }
  });
}

};
