"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.produitsService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.produitsService = {
    lister: () => prisma.produit.findMany(),
    creer: (data) => prisma.produit.create({ data }),
    modifier: (id, data) => prisma.produit.update({
        where: { id },
        data
    }),
    supprimer: async (id) => {
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
