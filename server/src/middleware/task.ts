import { Request, Response, NextFunction } from "express";
import Task, { ITask } from "../models/Task";

declare global {
  namespace Express {
    interface Request {
      task: ITask;
    }
  }
}

export async function TaskExists(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { idTask } = req.params;
    const task = await Task.findById(idTask);
    if (!task) {
      const error = new Error("Tarea no encontrada");
      return res.status(404).json({ error: error.message });
    }
    req.task = task;
    next();
  } catch (error) {
    return res.status(500).json({ error: "Hubo un error" });
  }
}

export function TaskBelongToProject(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.task.project.toString() !== req.project.id) {
    const error = new Error("Accion no Valida");
    return res.status(400).json({ error: error.message });
  }
  next();
}

export function hasAuthorization(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.user.id.toString() !== req.project.manager.toString()) {
    const error = new Error("Accion no Valida");
    return res.status(400).json({ error: error.message });
  }
  next();
}
