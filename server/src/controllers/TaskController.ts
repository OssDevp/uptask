import type { Request, Response } from "express";
import Task from "../models/Task";
import path from "path";

export class TaskController {
  static async createTask(req: Request, res: Response) {
    try {
      const task = new Task(req.body);
      task.project = req.project.id;
      req.project.tasks.push(task.id);
      await Promise.allSettled([task.save(), req.project.save()]);
      res.status(200).send("Task creado con exito");
    } catch (error) {
      return res.status(500).json({ error: "Hubo un error" });
    }
  }

  static async getTask(req: Request, res: Response) {
    try {
      const tasks = await Task.find({ project: req.params.idProject }).populate(
        "project"
      );
      res.status(200).send(tasks);
    } catch (error) {
      return res.status(500).json({ error: "Hubo un error" });
    }
  }

  static async getTaskByID(req: Request, res: Response) {
    try {
      const task = await Task.findById(req.task.id)
        .populate({ path: "completedBy.user", select: "id name email" })
        .populate({
          path: "note",
          populate: { path: "createdBy", select: "id name email" },
        });
      res.json(task);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Hubo un error" });
    }
  }

  static async updateTask(req: Request, res: Response) {
    try {
      req.task.name = req.body.name;
      req.task.description = req.body.description;
      await req.task.save();
      res.send("Tarea Actualizada");
    } catch (error) {
      return res.status(500).json({ error: "Hubo un error" });
    }
  }

  static async deleteTask(req: Request, res: Response) {
    try {
      req.project.tasks = req.project.tasks.filter(
        (task) => task.toString() !== req.task.id.toString()
      );
      await Promise.allSettled([req.task.deleteOne(), req.project.save()]);
      res.send("Tarea Eliminada");
    } catch (error) {
      return res.status(500).json({ error: "Hubo un error" });
    }
  }

  static async updateStatusTask(req: Request, res: Response) {
    try {
      const { status } = req.body;
      req.task.status = status;

      const data = {
        user: req.user.id,
        status,
      };

      req.task.completedBy.push(data);

      await req.task.save();
      res.send("Status Modificado");
    } catch (error) {
      return res.status(500).json({ error: "Hubo un error" });
    }
  }
}
