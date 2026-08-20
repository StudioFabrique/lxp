import { useState } from "react";
import toast from "react-hot-toast";
import { courseApi } from "../api/course.api";

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
        const data = await courseApi.mutations.deleteCourse(showModal.id);
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
