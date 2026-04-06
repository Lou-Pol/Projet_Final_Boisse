"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exigerRoles = exports.verifierToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const CLE = process.env.JWT_SECRET || "dev-secret";
/**
 * Vérifie la présence et la validité du token JWT.
 * Ajoute l'utilisateur décodé dans req.utilisateur.
 */
const verifierToken = (req, res, next) => {
    const header = req.headers.authorization;
    if (!header) {
        return res.status(401).json({ message: "Token manquant" });
    }
    const token = header.split(" ")[1];
    try {
        const payload = jsonwebtoken_1.default.verify(token, CLE);
        req.utilisateur = payload;
        next();
    }
    catch (e) {
        return res.status(401).json({ message: "Token invalide" });
    }
};
exports.verifierToken = verifierToken;
/**
 * Vérifie que l'utilisateur possède le rôle requis.
 * Utilisation : exigerRole("ADMIN") ou exigerRole("USER")
 */
const exigerRoles = (roles) => {
    return (req, res, next) => {
        const utilisateur = req.utilisateur;
        if (!utilisateur) {
            return res.status(401).json({ message: "Non authentifié" });
        }
        if (!roles.includes(utilisateur.role)) {
            return res.status(403).json({ message: "Accès refusé" });
        }
        next();
    };
};
exports.exigerRoles = exigerRoles;
