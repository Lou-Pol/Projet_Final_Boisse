import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const produitsService = {
  lister: () => prisma.produit.findMany(),

  creer: (data: { nom: string; prix: number; stock: number; categorie: string }) =>
    prisma.produit.create({ data }),

  modifier: (id: number, data: { nom: string; prix: number; stock: number; categorie: string }) =>
    prisma.produit.update({
      where: { id },
      data
    }),

  supprimer: async (id: number) => {
    // 1) Supprimer les lignes de commande liées au produit
    await prisma.ligneCommande.deleteMany({
      where: { idProduit: id }
    });

    // 2) Supprimer le produit
    return prisma.produit.delete({
      where: { id }
    });
  }
};
