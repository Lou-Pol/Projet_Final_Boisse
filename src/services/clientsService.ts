import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const clientsService = {
  lister: () => prisma.client.findMany(),

  creer: (data: { nom: string; email: string }) =>
    prisma.client.create({ data }),

  modifier: (id: number, data: { nom: string; email: string }) =>
    prisma.client.update({
      where: { id },
      data
    }),

  supprimer: async (id: number) => {
    // 1) Supprimer les commandes du client
    const commandes = await prisma.commande.findMany({
      where: { idClient: id }
    });

    for (const cmd of commandes) {
      await prisma.ligneCommande.deleteMany({
        where: { idCommande: cmd.id }
      });

      await prisma.commande.delete({
        where: { id: cmd.id }
      });
    }

    // 2) Supprimer le client
    return prisma.client.delete({
      where: { id }
    });
  }
};
