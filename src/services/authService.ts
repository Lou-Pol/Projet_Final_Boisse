import axios from "axios";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const connexionSansMotDePasse = async (email: string) => {
  const { data: users } = await axios.get("https://jsonplaceholder.typicode.com/users");
  const user = users.find((u: any) => u.email === email);

  if (!user) {
    throw new Error("Email inconnu dans JSONPlaceholder");
  }

  const nbUtilisateurs = await prisma.utilisateurLocal.count();
  const role = nbUtilisateurs === 0 ? "ADMIN" : "USER";

  let utilisateurLocal = await prisma.utilisateurLocal.findUnique({
    where: { idJsonPlaceholder: user.id }
  });

  if (!utilisateurLocal) {
    utilisateurLocal = await prisma.utilisateurLocal.create({
      data: {
        idJsonPlaceholder: user.id,
        email,
        role
      }
    });
  }

  return utilisateurLocal;
};
