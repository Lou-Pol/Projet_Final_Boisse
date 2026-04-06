import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Retourne l'utilisateur local 
 */
export const obtenirRolePourUtilisateur = async (idJsonPlaceholder: number) => {
  return prisma.utilisateurLocal.findUnique({
    where: { idJsonPlaceholder }
  });
};

/**
 * Change le rôle d'un utilisateur local existant
 */
export const definirRolePourUtilisateur = async (
  idJsonPlaceholder: number,
  role: "ADMIN" | "USER"
) => {
  return prisma.utilisateurLocal.update({
    where: { idJsonPlaceholder },
    data: { role }
  });
};

/**
 * Liste tous les utilisateurs locaux
 */
export const listerRoles = async () => {
  return prisma.utilisateurLocal.findMany();
};
