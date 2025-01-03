import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/Users";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const barear = req.headers.authorization;
  if (!barear) {
    const error = new Error("No autorizado");
    return res.status(500).json({ error: error.message });
  }

  const token = barear.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (typeof decoded === "object" && decoded.id) {
      const user = await User.findById(decoded.id).select("_id name email");
      if (user) {
        req.user = user;
        next();
      } else {
        return res.status(500).json({ error: "Token no valido" });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: "Token no valido" });
  }
};