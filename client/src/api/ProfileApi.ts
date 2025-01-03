import { isAxiosError } from "axios";
import { UserPasswordForm, UserProfileForm } from "../types";
import api from "@/lib/config";

export async function updateProfile(
  formData: UserProfileForm
): Promise<string | undefined> {
  try {
    const url = "auth/profile";
    const { data } = await api.put<string>(url, formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function updatePassword(
  formData: UserPasswordForm
): Promise<string | undefined> {
  try {
    const url = "auth/profile/update-password";
    const { data } = await api.put<string>(url, formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}
