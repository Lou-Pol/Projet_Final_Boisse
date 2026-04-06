"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientsService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.clientsService = {
    lister: () => prisma.client.findMany(),
    creer: (data) => prisma.client.create({ data }),
    modifier: (id, data) => prisma.client.update({
        where: { id },
        data
    }),
    supprimer: async (id) => {
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
