import api from "@/lib/config";
import {
  dashboardProjectSchema,
  editProjectSchema,
  Project,
  ProjectFormData,
  projectSchema,
} from "../types";
import { isAxiosError } from "axios";

export async function createProject(dataForm: ProjectFormData) {
  try {
    const { data } = await api.post("/projects", dataForm);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function getProject() {
  try {
    const { data } = await api("/projects");
    const response = dashboardProjectSchema.safeParse(data);
    if (response) {
      return response.data;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function getProjectById(projectId: Project["_id"]) {
  try {
    const { data } = await api(`/projects/${projectId}`);
    const response = editProjectSchema.safeParse(data);
    if (response.success) return response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function getProjectFull(projectId: Project["_id"]) {
  try {
    const { data } = await api(`/projects/${projectId}`);
    const response = projectSchema.safeParse(data);
    if (response.success) return response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

type editProjectByIdProps = {
  formData: ProjectFormData;
  projectId: Project["_id"];
};

export async function editProjecById({
  formData,
  projectId,
}: editProjectByIdProps) {
  try {
    const { data } = await api.put<string>(`/projects/${projectId}`, formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function deleteProject(projectId: Project["_id"]) {
  try {
    const { data } = await api.delete<string>(`/projects/${projectId}`);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}
