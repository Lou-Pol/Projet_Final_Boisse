import axios from "axios";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface UtilisateurApi {
  id: number;
  email: string;
}

export const connexionSansMotDePasse = async (email: string) => {
  const { data: users } = await axios.get<UtilisateurApi[]>(
    "https://jsonplaceholder.typicode.com/users"
  );

  const user = users.find((u) => u.email === email);

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
