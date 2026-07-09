import { useState } from "react";
import toast from "react-hot-toast";
import apiClient from "../lib/axios";

interface WithId {
  id: number;
}

export default function useDeleteCourse<T extends WithId>(
  onRefreshCourses: () => void,
) {
  const [showModal, setShowModal] = useState<T | null>(null);

  const handleShowModal = (course: T) => {
    setShowModal(course);
  };

  const handleCloseModal = () => {
    setShowModal(null);
  };

  const handleDeleteCourse = async () => {
    if (showModal) {
      try {
        const response = await apiClient.delete(
          `/course/delete-course/${showModal.id}`,
        );
        const data = response.data as { success: boolean; message: string };
        if (data.success) toast.success(data.message);
        setShowModal(null);
        onRefreshCourses();
      } catch (err: unknown) {
        const message =
          (err as { response?: { data?: { message?: string } } })?.response
            ?.data?.message ?? "Erreur inconnue";
        toast.error(message);
      }
    }
  };

  return {
    showModal,
    handleShowModal,
    handleCloseModal,
    handleDeleteCourse,
  };
}
