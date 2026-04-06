"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connexionSansMotDePasse = void 0;
const axios_1 = __importDefault(require("axios"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const connexionSansMotDePasse = async (email) => {
    const { data: users } = await axios_1.default.get("https://jsonplaceholder.typicode.com/users");
    const user = users.find((u) => u.email === email);
    if (!user) {
        throw new Error("Email inconnu dans JSONPlaceholder");
    }
    const nbUtilisateurs = await prisma.utilisateurLocal.count();
    const role = nbUtilisateurs === 0 ? "ADMIN" : "USER";
    let utilisateurLocal = await prisma.utilisateurLocal.findUnique({
        where: { idJsonPlaceholder: user.id }
    });
    if (!utilisateurLocal) {
        utilisateurLocal = await prisma.utilisateurLocal.create({
            data: {
                idJsonPlaceholder: user.id,
                email,
                role
            }
        });
    }
    return utilisateurLocal;
};
exports.connexionSansMotDePasse = connexionSansMotDePasse;
