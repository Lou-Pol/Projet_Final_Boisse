import { Router } from "express";
import { repondreErreur } from "../utils/erreurs";
import { commandesService } from "../services/commandesService";
import { exigerRoles } from "../middleware/auth";

const routeur = Router();

// 📌 Lecture : PUBLIC (pour dashboard)
routeur.get("/", async (_req, res) => {
  try {
    const commandes = await commandesService.lister();
    res.json(commandes);
  } catch (e) {
    repondreErreur(res, e, "Erreur liste commandes");
  }
});

// 📌 Création : USER uniquement
routeur.post("/", exigerRoles(["USER"]), async (req, res) => {
  try {
    const { idClient, statut, produits } = req.body;

    if (!idClient || !statut || !produits) {
      return res.status(400).json({ message: "Champs requis manquants" });
    }

    const commande = await commandesService.creer({
      idClient,
      statut,
      produits
    });

    res.status(201).json(commande);
  } catch (e) {
    repondreErreur(res, e, "Erreur création commande");
  }
});

// 📌 Modification : USER uniquement
routeur.put("/:id", exigerRoles(["USER"]), async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { idClient, statut } = req.body;

    const commande = await commandesService.modifier(id, {
      idClient,
      statut
    });

    res.json(commande);
  } catch (e) {
    repondreErreur(res, e, "Erreur mise à jour commande");
  }
});

// 📌 Suppression : USER uniquement
routeur.delete("/:id", exigerRoles(["USER"]), async (req, res) => {
  try {
    const id = Number(req.params.id);
    await commandesService.supprimer(id);
    res.status(204).end();
  } catch (e) {
    repondreErreur(res, e, "Erreur suppression commande");
  }
});

// 📌 Changer le statut : USER uniquement
routeur.put("/:id/statut", exigerRoles(["USER"]), async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { statut } = req.body;

    if (!statut) {
      return res.status(400).json({ message: "Statut manquant" });
    }

    const commande = await commandesService.modifier(id, { statut });

    res.json(commande);
  } catch (e) {
    repondreErreur(res, e, "Erreur changement statut");
  }
});

export default routeur;
