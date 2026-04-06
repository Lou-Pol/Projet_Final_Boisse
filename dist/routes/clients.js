"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const erreurs_1 = require("../utils/erreurs");
const clientsService_1 = require("../services/clientsService");
const commandesService_1 = require("../services/commandesService");
const auth_1 = require("../middleware/auth");
const routeur = (0, express_1.Router)();
// 📌 Lecture : ADMIN + USER
routeur.get("/", (0, auth_1.exigerRoles)(["ADMIN", "USER"]), async (_req, res) => {
    try {
        const clients = await clientsService_1.clientsService.lister();
        res.json(clients);
    }
    catch (e) {
        (0, erreurs_1.repondreErreur)(res, e, "Erreur liste clients");
    }
});
// 📌 Commandes d’un client : ADMIN + USER
routeur.get("/:id/commandes", (0, auth_1.exigerRoles)(["ADMIN", "USER"]), async (req, res) => {
    try {
        const idClient = Number(req.params.id);
        const commandes = await commandesService_1.commandesService.listerParClient(idClient);
        res.json(commandes);
    }
    catch (e) {
        (0, erreurs_1.repondreErreur)(res, e, "Erreur récupération commandes du client");
    }
});
// 📌 Création : USER uniquement
routeur.post("/", (0, auth_1.exigerRoles)(["USER"]), async (req, res) => {
    try {
        const { nom, email } = req.body;
        if (!nom || !email) {
            return res.status(400).json({ message: "Nom et email requis" });
        }
        const client = await clientsService_1.clientsService.creer({ nom, email });
        res.status(201).json(client);
    }
    catch (e) {
        (0, erreurs_1.repondreErreur)(res, e, "Erreur création client");
    }
});
// 📌 Modification : USER uniquement
routeur.put("/:id", (0, auth_1.exigerRoles)(["USER"]), async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { nom, email } = req.body;
        const client = await clientsService_1.clientsService.modifier(id, { nom, email });
        res.json(client);
    }
    catch (e) {
        (0, erreurs_1.repondreErreur)(res, e, "Erreur mise à jour client");
    }
});
// 📌 Suppression : USER uniquement
routeur.delete("/:id", (0, auth_1.exigerRoles)(["USER"]), async (req, res) => {
    try {
        const id = Number(req.params.id);
        await clientsService_1.clientsService.supprimer(id);
        res.status(204).end();
    }
    catch (e) {
        (0, erreurs_1.repondreErreur)(res, e, "Erreur suppression client");
    }
});
exports.default = routeur;
