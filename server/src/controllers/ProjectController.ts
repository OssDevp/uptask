import type { Request, Response } from "express";
import Project from "../models/Project";

export class ProjectController {
  static async createProject(req: Request, res: Response) {
    const project = new Project(req.body);
    project.manager = req.user.id;
    try {
      await project.save();
      res.status(200).send("Proyecto creado Correctamente");
    } catch (err) {
      return res.status(500).json({ error: "Hubo un error" });
    }
  }

  static async getAllProject(req: Request, res: Response) {
    try {
      const data = await Project.find({
        $or: [
          { manager: { $in: req.user.id } },
          { teams: { $in: req.user.id } },
        ],
      });
      res.status(200).send(data);
    } catch (err) {
      return res.status(500).json({ error: "Hubo un error" });
    }
  }

  static async getProjectByID(req: Request, res: Response) {
    const { idProject } = req.params;
    try {
      const project = await Project.findById(idProject).populate("tasks");
      if (!project) {
        const err = new Error("No existe el proyecto");
        return res.status(404).json({ erroro: err.message });
      }

      if (
        project.manager.toString() !== req.user.id.toString() &&
        !project.teams.includes(req.user.id)
      ) {
        const err = new Error("Acción no autorizada");
        return res.status(404).json({ error: err.message });
      }

      res.status(200).json(project);
    } catch (err) {
      return res.status(500).json({ error: "Hubo un error" });
    }
  }

  static async updateProject(req: Request, res: Response) {
    try {
      req.project.projectName = req.body.projectName;
      req.project.clientName = req.body.clientName;
      req.project.description = req.body.description;
      await req.project.save();
      res.status(200).send("Actualizado Correctamente");
    } catch (err) {
      return res.status(500).json({ error: "Hubo un error" });
    }
  }

  static async deleteProject(req: Request, res: Response) {
    try {
      await req.project.deleteOne();
      res.send("Se elimino con exito");
    } catch (err) {
      return res.status(500).json({ error: "Hubo un error" });
    }
  }
}
