"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const erreurs_1 = require("../utils/erreurs");
const produitsService_1 = require("../services/produitsService");
const auth_1 = require("../middleware/auth");
const routeur = (0, express_1.Router)();
// 📌 Lecture : ADMIN + USER
routeur.get("/", (0, auth_1.exigerRoles)(["ADMIN", "USER"]), async (_req, res) => {
    try {
        const produits = await produitsService_1.produitsService.lister();
        res.json(produits);
    }
    catch (e) {
        (0, erreurs_1.repondreErreur)(res, e, "Erreur liste produits");
    }
});
// 📌 Création : USER uniquement
routeur.post("/", (0, auth_1.exigerRoles)(["USER"]), async (req, res) => {
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
        const produit = await produitsService_1.produitsService.creer({
            nom,
            prix: prixNum,
            stock: stockNum,
            categorie
        });
        res.status(201).json(produit);
    }
    catch (e) {
        (0, erreurs_1.repondreErreur)(res, e, "Erreur création produit");
    }
});
// 📌 Modification : USER uniquement
routeur.put("/:id", (0, auth_1.exigerRoles)(["USER"]), async (req, res) => {
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
        const produit = await produitsService_1.produitsService.modifier(id, {
            nom,
            prix: prixNum,
            stock: stockNum,
            categorie
        });
        res.json(produit);
    }
    catch (e) {
        (0, erreurs_1.repondreErreur)(res, e, "Erreur mise à jour produit");
    }
});
// 📌 Suppression : USER uniquement
routeur.delete("/:id", (0, auth_1.exigerRoles)(["USER"]), async (req, res) => {
    try {
        const id = Number(req.params.id);
        await produitsService_1.produitsService.supprimer(id);
        res.status(204).end();
    }
    catch (e) {
        (0, erreurs_1.repondreErreur)(res, e, "Erreur suppression produit");
    }
});
exports.default = routeur;
