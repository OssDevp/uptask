import { NextFunction, Request, Response } from "express";
import Project, { IProject } from "../models/Project";

declare global {
  namespace Express {
    interface Request {
      project: IProject;
    }
  }
}

export async function ProjectExists(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { idProject } = req.params;
    const project = await Project.findById(idProject);
    if (!project) {
      const error = new Error("Proyecto no encontrado");
      return res.status(404).json({ error: error.message });
    }
    req.project = project;
    next();
  } catch (error) {
    return res.status(500).json({ error: "Hubo un error" });
  }
}
