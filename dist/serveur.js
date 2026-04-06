"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lancerServeur = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = require("dotenv");
const clients_1 = __importDefault(require("./routes/clients"));
const produits_1 = __importDefault(require("./routes/produits"));
const commandes_1 = __importDefault(require("./routes/commandes"));
const adminUsers_1 = __importDefault(require("./routes/adminUsers"));
(0, dotenv_1.config)();
const lancerServeur = async () => {
    const app = (0, express_1.default)();
    const port = process.env.PORT || 4000;
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    app.use("/api/clients", clients_1.default);
    app.use("/api/produits", produits_1.default);
    app.use("/api/commandes", commandes_1.default);
    app.use("/api/roles-utilisateurs", adminUsers_1.default);
    app.get("/api/sante", (_req, res) => {
        res.json({ statut: "ok" });
    });
    app.use((err, _req, res, _next) => {
        console.error("Erreur non gérée :", err);
        res.status(500).json({ message: "Erreur interne du serveur" });
    });
    app.listen(port, () => {
        console.log(`Serveur backend démarré sur le port ${port}`);
    });
};
exports.lancerServeur = lancerServeur;
