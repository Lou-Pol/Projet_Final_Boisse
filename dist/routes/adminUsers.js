"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const axios_1 = __importDefault(require("axios"));
const client_1 = require("@prisma/client");
const erreurs_1 = require("../utils/erreurs");
const auth_1 = require("../middleware/auth");
const prisma = new client_1.PrismaClient();
const routeur = (0, express_1.Router)();
// 📌 Lecture : ADMIN uniquement
routeur.get("/", (0, auth_1.exigerRoles)(["ADMIN"]), async (_req, res) => {
    try {
        const rep = await axios_1.default.get("https://jsonplaceholder.typicode.com/users");
        const usersApi = rep.data;
        const usersLocal = await prisma.utilisateurLocal.findMany();
        const fusion = usersApi.map((u) => {
            const local = usersLocal.find((l) => l.idJsonPlaceholder === u.id);
            return {
                idJsonPlaceholder: u.id,
                name: u.name,
                email: u.email,
                role: local ? local.role : null
            };
        });
        res.json(fusion);
    }
    catch (e) {
        (0, erreurs_1.repondreErreur)(res, e, "Erreur liste utilisateurs admin");
    }
});
// 📌 Modification rôle : ADMIN uniquement
routeur.put("/:idJsonPlaceholder/role", (0, auth_1.exigerRoles)(["ADMIN"]), async (req, res) => {
    try {
        const idJsonPlaceholder = Number(req.params.idJsonPlaceholder);
        const { role } = req.body;
        if (!["ADMIN", "USER"].includes(role)) {
            return res.status(400).json({ message: "Rôle invalide" });
        }
        const rep = await axios_1.default.get("https://jsonplaceholder.typicode.com/users");
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
                    role: role
                }
            });
        }
        else {
            userLocal = await prisma.utilisateurLocal.update({
                where: { email: userApi.email },
                data: { role: role }
            });
        }
        res.json(userLocal);
    }
    catch (e) {
        (0, erreurs_1.repondreErreur)(res, e, "Erreur changement rôle");
    }
});
exports.default = routeur;
