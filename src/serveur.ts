import express, { Application } from "express";
import cors from "cors";
import { config } from "dotenv";
import clientsRouteur from "./routes/clients";
import produitsRouteur from "./routes/produits";
import commandesRouteur from "./routes/commandes";
import rolesUtilisateursRouteur from "./routes/adminUsers";

config();

export const lancerServeur = async () => {
  const app: Application = express();
  const port = process.env.PORT || 4000;

  app.use(cors());
  app.use(express.json());

  app.use("/api/clients", clientsRouteur);
  app.use("/api/produits", produitsRouteur);
  app.use("/api/commandes", commandesRouteur);
  app.use("/api/roles-utilisateurs", rolesUtilisateursRouteur);

  app.get("/api/sante", (_req, res) => {
    res.json({ statut: "ok" });
  });

  app.use(
    (
      err: any,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction
    ) => {
      console.error("Erreur non gérée :", err);
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  );

  app.listen(port, () => {
    console.log(`Serveur backend démarré sur le port ${port}`);
  });
};
