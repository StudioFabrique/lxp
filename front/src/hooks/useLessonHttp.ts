import { useState } from "react";
import apiClient from "../lib/axios";

export default function useLessonHTTP() {
  const [error, setError] = useState("");

  const deleteLesson = async (id: number) => {
    try {
      const response = await apiClient.delete(`/lesson/${id}`);
      return response.data;
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Erreur inconnue";
      setError(message);
      throw err;
    }
  };

  return { error, deleteLesson };
}
