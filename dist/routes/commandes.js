"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const erreurs_1 = require("../utils/erreurs");
const commandesService_1 = require("../services/commandesService");
const auth_1 = require("../middleware/auth");
const routeur = (0, express_1.Router)();
// 📌 Lecture : ADMIN + USER
routeur.get("/", (0, auth_1.exigerRoles)(["ADMIN", "USER"]), async (_req, res) => {
    try {
        const commandes = await commandesService_1.commandesService.lister();
        res.json(commandes);
    }
    catch (e) {
        (0, erreurs_1.repondreErreur)(res, e, "Erreur liste commandes");
    }
});
// 📌 Création : USER uniquement
routeur.post("/", (0, auth_1.exigerRoles)(["USER"]), async (req, res) => {
    try {
        const { idClient, statut, produits } = req.body;
        if (!idClient || !statut || !produits) {
            return res.status(400).json({ message: "Champs requis manquants" });
        }
        const commande = await commandesService_1.commandesService.creer({
            idClient,
            statut,
            produits
        });
        res.status(201).json(commande);
    }
    catch (e) {
        (0, erreurs_1.repondreErreur)(res, e, "Erreur création commande");
    }
});
// 📌 Modification : USER uniquement
routeur.put("/:id", (0, auth_1.exigerRoles)(["USER"]), async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { idClient, statut } = req.body;
        const commande = await commandesService_1.commandesService.modifier(id, {
            idClient,
            statut
        });
        res.json(commande);
    }
    catch (e) {
        (0, erreurs_1.repondreErreur)(res, e, "Erreur mise à jour commande");
    }
});
// 📌 Suppression : USER uniquement
routeur.delete("/:id", (0, auth_1.exigerRoles)(["USER"]), async (req, res) => {
    try {
        const id = Number(req.params.id);
        await commandesService_1.commandesService.supprimer(id);
        res.status(204).end();
    }
    catch (e) {
        (0, erreurs_1.repondreErreur)(res, e, "Erreur suppression commande");
    }
});
// 📌 Changer le statut : USER uniquement
routeur.put("/:id/statut", (0, auth_1.exigerRoles)(["USER"]), async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { statut } = req.body;
        if (!statut) {
            return res.status(400).json({ message: "Statut manquant" });
        }
        const commande = await commandesService_1.commandesService.modifier(id, { statut });
        res.json(commande);
    }
    catch (e) {
        (0, erreurs_1.repondreErreur)(res, e, "Erreur changement statut");
    }
});
exports.default = routeur;
