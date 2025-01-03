import api from "@/lib/config";
import { isAxiosError } from "axios";
import { Note, NoteFormData, Project, Task } from "../types";

type NoteApiType = {
  formData: NoteFormData;
  projectId: Project["_id"];
  taskId: Task["_id"];
  noteId: Note["_id"];
};

export async function createNote({
  formData,
  projectId,
  taskId,
}: Pick<NoteApiType, "formData" | "projectId" | "taskId">) {
  try {
    const url = `/projects/${projectId}/task/${taskId}/notes`;
    const { data } = await api.post<string>(url, formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function getNote({
  projectId,
  taskId,
}: Pick<NoteApiType, "projectId" | "taskId">) {
  try {
    const url = `/projects/${projectId}/tasks/${taskId}/notes`;
    const { data } = await api<string>(url);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function removeNote({
  projectId,
  taskId,
  noteId,
}: Pick<NoteApiType, "projectId" | "taskId" | "noteId">) {
  try {
    const url = `/projects/${projectId}/task/${taskId}/notes/${noteId}`;
    const { data } = await api.delete<string>(url);
    return data;
  } catch (error) {
    console.log(error);
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}
