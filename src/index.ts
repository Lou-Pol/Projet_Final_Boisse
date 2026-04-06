import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import adminUsersRoutes from "./routes/adminUsers";
import clientsRoutes from "./routes/clients";
import produitsRoutes from "./routes/produits";
import commandesRoutes from "./routes/commandes";
import { verifierToken, exigerRoles } from "./middleware/auth";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/sante", (_req, res) => res.json({ statut: "ok" }));

// Auth publique
app.use("/api/auth", authRoutes);

// ADMIN USERS → protégé
app.use("/api/admin/users", verifierToken, exigerRoles(["ADMIN"]), adminUsersRoutes);

// CLIENTS → GET public, le reste protégé dans le fichier de route
app.use("/api/clients", clientsRoutes);

// PRODUITS → GET public, le reste protégé dans le fichier de route
app.use("/api/produits", produitsRoutes);

// COMMANDES → GET public, le reste protégé dans le fichier de route
app.use("/api/commandes", commandesRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend sur ${PORT}`));
