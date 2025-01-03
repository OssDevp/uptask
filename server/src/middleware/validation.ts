import type { Request, Response, NextFunction } from "express";
import {
  Result,
  type ValidationError,
  validationResult,
} from "express-validator";

//verifica si hay un error en las validaciones con express-validator
export function handleInputErrors(
  req: Request,
  res: Response,
  next: NextFunction,
): Response<any, Record<string, any>> | undefined {
  let err: Result<ValidationError> = validationResult(req);
  if (!err.isEmpty()) {
    return res.status(400).json({ error: err.array() });
  }

  next();
}
