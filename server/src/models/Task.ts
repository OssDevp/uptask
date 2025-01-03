import mongoose, { Schema, Document, Types } from "mongoose";
import Note from "./Note";

export enum taskStatus {
  PENDING = "pending",
  ON_HOLD = "onHold",
  IN_PROGRESS = "inProgress",
  UNDER_RECIEW = "underReview",
  COMPLETED = "completed",
}

export interface ITask extends Document {
  name: string;
  description: string;
  project: Types.ObjectId;
  status: taskStatus;
  completedBy: {
    user: Types.ObjectId;
    status: taskStatus;
  }[];
  note: Types.ObjectId[];
}

export const TaskSchema = new Schema<ITask>(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(taskStatus),
      default: taskStatus.PENDING,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
    },
    completedBy: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        status: {
          type: String,
          enum: Object.values(taskStatus),
          default: taskStatus.PENDING,
        },
      },
    ],
    note: [
      {
        type: Schema.Types.ObjectId,
        ref: "Note",
      },
    ],
  },
  { timestamps: true }
);

//elimina las notas relacionadas con la tarea
TaskSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function () {
    const taskId = this._id;
    if (taskId) {
      await Note.deleteMany({ task: taskId });
    }
  }
);

const Task = mongoose.model<ITask>("Task", TaskSchema);
export default Task;
