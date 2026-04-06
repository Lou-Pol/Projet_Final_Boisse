import { Router } from "express";
import { repondreErreur } from "../utils/erreurs";
import { produitsService } from "../services/produitsService";
import { exigerRoles } from "../middleware/auth";

const routeur = Router();

// 📌 Lecture : ADMIN + USER
routeur.get("/", exigerRoles(["ADMIN", "USER"]), async (_req, res) => {
  try {
    const produits = await produitsService.lister();
    res.json(produits);
  } catch (e) {
    repondreErreur(res, e, "Erreur liste produits");
  }
});

// 📌 Création : USER uniquement
routeur.post("/", exigerRoles(["USER"]), async (req, res) => {
  try {
    const { nom, prix, stock, categorie } = req.body;
    if (!nom || !categorie) {
      return res.status(400).json({ message: "Nom et catégorie requis" });
    }

    const prixNum = Number(prix);
    const stockNum = Number(stock);

    if (isNaN(prixNum) || prixNum < 0) {
      return res.status(400).json({ message: "Prix invalide" });
    }
    if (!Number.isInteger(stockNum) || stockNum < 0) {
      return res.status(400).json({ message: "Stock invalide" });
    }

    const produit = await produitsService.creer({
      nom,
      prix: prixNum,
      stock: stockNum,
      categorie
    });
    res.status(201).json(produit);
  } catch (e) {
    repondreErreur(res, e, "Erreur création produit");
  }
});

// 📌 Modification : USER uniquement
routeur.put("/:id", exigerRoles(["USER"]), async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nom, prix, stock, categorie } = req.body;

    const prixNum = Number(prix);
    const stockNum = Number(stock);

    if (isNaN(prixNum) || prixNum < 0) {
      return res.status(400).json({ message: "Prix invalide" });
    }
    if (!Number.isInteger(stockNum) || stockNum < 0) {
      return res.status(400).json({ message: "Stock invalide" });
    }

    const produit = await produitsService.modifier(id, {
      nom,
      prix: prixNum,
      stock: stockNum,
      categorie
    });
    res.json(produit);
  } catch (e) {
    repondreErreur(res, e, "Erreur mise à jour produit");
  }
});

// 📌 Suppression : USER uniquement
routeur.delete("/:id", exigerRoles(["USER"]), async (req, res) => {
  try {
    const id = Number(req.params.id);
    await produitsService.supprimer(id);
    res.status(204).end();
  } catch (e) {
    repondreErreur(res, e, "Erreur suppression produit");
  }
});

export default routeur;
