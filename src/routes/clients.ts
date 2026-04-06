import { Router } from "express";
import { repondreErreur } from "../utils/erreurs";
import { clientsService } from "../services/clientsService";
import { commandesService } from "../services/commandesService";
import { verifierToken, exigerRoles } from "../middleware/auth";

const routeur = Router();

routeur.get("/", async (req, res) => {

  try {
    const clients = await clientsService.lister();
    res.json(clients);
  } catch (e) {
    repondreErreur(res, e, "Erreur liste clients");
  }
});

routeur.get("/:id/commandes", async (req, res) => {
  try {
    const idClient = Number(req.params.id);
    const commandes = await commandesService.listerParClient(idClient);
    res.json(commandes);
  } catch (e) {
    repondreErreur(res, e, "Erreur récupération commandes du client");
  }
});

routeur.post("/",verifierToken, exigerRoles(["USER"]), async (req, res) => {
  try {
    const { nom, email } = req.body;
    if (!nom || !email) {
      return res.status(400).json({ message: "Nom et email requis" });
    }
    const client = await clientsService.creer({ nom, email });
    res.status(201).json(client);
  } catch (e) {
    repondreErreur(res, e, "Erreur création client");
  }
});

routeur.put("/:id",verifierToken, exigerRoles(["USER"]), async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nom, email } = req.body;
    const client = await clientsService.modifier(id, { nom, email });
    res.json(client);
  } catch (e) {
    repondreErreur(res, e, "Erreur mise à jour client");
  }
});

routeur.delete("/:id",verifierToken, exigerRoles(["USER"]), async (req, res) => {
  try {
    const id = Number(req.params.id);
    await clientsService.supprimer(id);
    res.status(204).end();
  } catch (e) {
    repondreErreur(res, e, "Erreur suppression client");
  }
});

export default routeur;
