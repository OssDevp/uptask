import mongoose, { Schema, Document, PopulatedDoc, Types } from "mongoose";
import type { ITask } from "./Task";
import { IUser } from "./Users";
import Task from "./Task";
import Note from "./Note";

export interface IProject extends Document {
  projectName: string;
  clientName: string;
  description: string;
  manager: PopulatedDoc<IUser & Document>;
  tasks: PopulatedDoc<ITask & Document>[];
  teams: PopulatedDoc<IUser & Document>[];
}

const ProjecSchema: Schema = new Schema<IProject>(
  {
    projectName: {
      type: String,
      required: true,
      trim: true,
    },
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    manager: {
      type: Types.ObjectId,
      ref: "User",
    },
    tasks: [
      {
        type: Types.ObjectId,
        ref: "Task",
      },
    ],
    teams: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

// elimina las tareas relacionadas con el proyecto
ProjecSchema.pre("deleteOne", { document: true }, async function () {
  const projectId = this._id;
  if (!projectId) return;

  const tasks = await Task.find({ project: projectId });
  for (const task of tasks) {
    await Note.deleteMany({ task: task.id });
  }

  await Task.deleteMany({ project: projectId });
});

const Project = mongoose.model<IProject>("Project", ProjecSchema);
export default Project;
