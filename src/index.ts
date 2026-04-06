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

app.use("/api/auth", authRoutes);

app.use("/api/admin/users", verifierToken, exigerRoles(["ADMIN"]), adminUsersRoutes);
app.use("/api/clients", verifierToken, exigerRoles(["USER"]), clientsRoutes);
app.use("/api/produits", verifierToken, exigerRoles(["USER"]), produitsRoutes);
app.use("/api/commandes", verifierToken, exigerRoles(["USER"]), commandesRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend sur ${PORT}`));
