import { Router } from "express";
import jwt from "jsonwebtoken";
import { connexionSansMotDePasse } from "../services/authService";
import { repondreErreur } from "../utils/erreurs";

const routeur = Router();
const CLE = process.env.JWT_SECRET || "dev-secret";

routeur.post("/login", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email requis" });
    }

    const utilisateur = await connexionSansMotDePasse(email);

    const token = jwt.sign(
      { id: utilisateur.id, role: utilisateur.role },
      CLE,
      { expiresIn: "2h" }
    );

    res.json({
      token,
      utilisateur: {
        id: utilisateur.id,
        email: utilisateur.email,
        role: utilisateur.role
      }
    });
  } catch (e) {
    repondreErreur(res, e, "Erreur login");
  }
});

export default routeur;
