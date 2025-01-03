import { Request, Response } from "express";
import Note, { INote } from "../models/Note";
import { Types } from "mongoose";

type NoteParams = {
  idNote: Types.ObjectId;
};

export class NoteController {
  static async createNote(req: Request<{}, {}, INote>, res: Response) {
    const { content } = req.body;
    console.log(content);

    const note = new Note();
    note.content = content;
    note.createdBy = req.user.id;
    note.task = req.task.id;

    req.task.note.push(note.id);

    try {
      await Promise.allSettled([note.save(), req.task.save()]);
      res.send("Nota creada con exito");
    } catch (error) {
      return res.status(500).json({ error: "Hubo un error" });
    }
  }

  static async getNotes(req: Request, res: Response) {
    try {
      const note = await Note.find({ task: req.task.id });
      res.json(note);
    } catch (error) {
      return res.status(500).json({ error: "Hubo un error" });
    }
  }

  static async removeNote(req: Request<NoteParams>, res: Response) {
    const { idNote } = req.params;
    const note = await Note.findById(idNote);
    try {
      if (!note) {
        const error = new Error("Nota no encontrada");
        return res.status(404).json({ error: error.message });
      }

      if (note.createdBy.toString() !== req.user.id.toString()) {
        const error = new Error("No tienes permisos para eliminar la nota");
        return res.status(403).json({ error: error.message });
      }

      req.task.note = req.task.note.filter((note) => {
        return note.toString() !== idNote.toString();
      });

      await Promise.allSettled([req.task.save(), note.deleteOne()]);
      res.send("Nota eliminada con exito");
    } catch (error) {
      return res.status(500).json({ error: "Hubo un error" });
    }
  }
}
