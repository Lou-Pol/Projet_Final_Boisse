import { Router } from "express";
import axios from "axios";
import { PrismaClient } from "@prisma/client";
import { repondreErreur } from "../utils/erreurs";
import { exigerRoles } from "../middleware/auth";

type RoleUtilisateur = "ADMIN" | "USER";

const prisma = new PrismaClient();
const routeur = Router();

interface UtilisateurApi {
  id: number;
  name: string;
  email: string;
}

// 📌 Lecture : ADMIN uniquement
routeur.get("/", exigerRoles(["ADMIN"]), async (_req, res) => {
  try {
    const rep = await axios.get<UtilisateurApi[]>(
      "https://jsonplaceholder.typicode.com/users"
    );
    const usersApi = rep.data;

    const usersLocal = await prisma.utilisateurLocal.findMany();

    const fusion = usersApi.map((u) => {
      const local = usersLocal.find(
        (l) => l.idJsonPlaceholder === u.id
      );

      return {
        idJsonPlaceholder: u.id,
        name: u.name,
        email: u.email,
        role: local ? local.role : null
      };
    });

    res.json(fusion);
  } catch (e) {
    repondreErreur(res, e, "Erreur liste utilisateurs admin");
  }
});

// 📌 Modification rôle : ADMIN uniquement
routeur.put("/:idJsonPlaceholder/role", exigerRoles(["ADMIN"]), async (req, res) => {
  try {
    const idJsonPlaceholder = Number(req.params.idJsonPlaceholder);
    const { role } = req.body;

    if (!["ADMIN", "USER"].includes(role)) {
      return res.status(400).json({ message: "Rôle invalide" });
    }

    const rep = await axios.get<UtilisateurApi[]>(
      "https://jsonplaceholder.typicode.com/users"
    );
    const userApi = rep.data.find((u) => u.id === idJsonPlaceholder);

    if (!userApi) {
      return res
        .status(404)
        .json({ message: "Utilisateur JSONPlaceholder introuvable" });
    }

    let userLocal = await prisma.utilisateurLocal.findUnique({
      where: { email: userApi.email }
    });

    if (!userLocal) {
      userLocal = await prisma.utilisateurLocal.create({
        data: {
          email: userApi.email,
          idJsonPlaceholder,
          role: role as RoleUtilisateur
        }
      });
    } else {
      userLocal = await prisma.utilisateurLocal.update({
        where: { email: userApi.email },
        data: { role: role as RoleUtilisateur }
      });
    }

    res.json(userLocal);
  } catch (e) {
    repondreErreur(res, e, "Erreur changement rôle");
  }
});

export default routeur;
