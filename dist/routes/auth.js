"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authService_1 = require("../services/authService");
const erreurs_1 = require("../utils/erreurs");
const routeur = (0, express_1.Router)();
const CLE = process.env.JWT_SECRET || "dev-secret";
routeur.post("/login", async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email requis" });
        }
        const utilisateur = await (0, authService_1.connexionSansMotDePasse)(email);
        const token = jsonwebtoken_1.default.sign({ id: utilisateur.id, role: utilisateur.role }, CLE, { expiresIn: "2h" });
        res.json({
            token,
            utilisateur: {
                id: utilisateur.id,
                email: utilisateur.email,
                role: utilisateur.role.toLowerCase()
            }
        });
    }
    catch (e) {
        (0, erreurs_1.repondreErreur)(res, e, "Erreur login");
    }
});
exports.default = routeur;
