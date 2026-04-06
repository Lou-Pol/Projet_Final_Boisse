import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const CLE = process.env.JWT_SECRET || "dev-secret";

/**
 * Vérifie la présence et la validité du token JWT.
 * Ajoute l'utilisateur décodé dans req.utilisateur.
 */
export const verifierToken = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ message: "Token manquant" });
  }

  const token = header.split(" ")[1];

  try {
    const payload = jwt.verify(token, CLE) as any;
    (req as any).utilisateur = payload;
    next();
  } catch (e) {
    return res.status(401).json({ message: "Token invalide" });
  }
};

/**
 * Vérifie que l'utilisateur possède le rôle requis.
 * Utilisation : exigerRole("ADMIN") ou exigerRole("USER")
 */
export const exigerRoles = (roles: ("ADMIN" | "USER")[]) => {
  return (req: any, res: any, next: any) => {
    const utilisateur = req.utilisateur;

    if (!utilisateur) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    const role = utilisateur.role?.toUpperCase(); // 🔥 Normalisation

    if (!roles.includes(role)) {
      return res.status(403).json({ message: "Accès refusé" });
    }

    next();
  };
};


