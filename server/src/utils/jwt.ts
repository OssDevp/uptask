import jwt from "jsonwebtoken";
import { Types } from "mongoose";

type UserPayload = {
  id: Types.ObjectId;
}

export function generateJWT(payload: UserPayload): string {
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
  return token;
}