import { Response } from "express";

export const repondreErreur = (res: Response, err: any, message: string) => {
  console.error(message, err);
  return res.status(500).json({ message });
};
