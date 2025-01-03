import type { Request, Response } from "express";
import User from "../models/Users";
import Project from "../models/Project";
import { Console } from "node:console";

export class TeamController {
  static async findMemberByEmail(req: Request, res: Response) {
    const { email } = req.body;

    try {
      const user = await User.findOne({ email }).select("id email name");
      if (!user) {
        const error = new Error("Usuario no encontrado");
        return res.status(404).json({ error: error.message });
      }
      res.json(user);
    } catch (error) {
      console.log(error);
    }
  }

  static async getMembers(req: Request, res: Response) {
    const project = await Project.findById(req.project.id).populate("teams");

    res.json(project.teams);
  }

  static async addMemberById(req: Request, res: Response) {
    const { id } = req.body;

    const user = await User.findById(id).select("id");
    if (!user) {
      const error = new Error("Usuario no encontrado");
      return res.status(404).json({ error: error.message });
    }

    if (
      req.project.teams.some((team) => team.toString() === user.id.toString())
    ) {
      const error = new Error("Usuario ya es miembro del proyecto");
      return res.status(409).json({ error: error.message });
    }

    req.project.teams.push(user.id);
    await req.project.save();
    res.send("Usuario agregado al proyecto");
  }

  static async removeMemberById(req: Request, res: Response) {
    const { userId } = req.params;

    if (!req.project.teams.some((team) => team.toString() === userId)) {
      const error = new Error("Usuario no existe en el proyecto");
      return res.status(409).json({ error: error.message });
    }

    req.project.teams = req.project.teams.filter(
      (teamMember) => teamMember.toString() !== userId
    );

    await req.project.save();
    res.send("Usuario eliminado del proyecto");
  }
}
