import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const CLE = process.env.JWT_SECRET || "dev-secret";

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

export const exigerRoles = (roles: ("ADMIN" | "USER")[]) => {
  return (req: any, res: any, next: any) => {
    const utilisateur = req.utilisateur;

    if (!utilisateur) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    const role = utilisateur.role?.toLowerCase(); 

    if (!roles.includes(role)) {
      return res.status(403).json({ message: "Accès refusé" });
    }

    next();
  };
};


