"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listerRoles = exports.definirRolePourUtilisateur = exports.obtenirRolePourUtilisateur = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/**
 * Retourne l'utilisateur local (donc son rôle)
 */
const obtenirRolePourUtilisateur = async (idJsonPlaceholder) => {
    return prisma.utilisateurLocal.findUnique({
        where: { idJsonPlaceholder }
    });
};
exports.obtenirRolePourUtilisateur = obtenirRolePourUtilisateur;
/**
 * Change le rôle d'un utilisateur local existant
 */
const definirRolePourUtilisateur = async (idJsonPlaceholder, role) => {
    return prisma.utilisateurLocal.update({
        where: { idJsonPlaceholder },
        data: { role }
    });
};
exports.definirRolePourUtilisateur = definirRolePourUtilisateur;
/**
 * Liste tous les utilisateurs locaux
 */
const listerRoles = async () => {
    return prisma.utilisateurLocal.findMany();
};
exports.listerRoles = listerRoles;
