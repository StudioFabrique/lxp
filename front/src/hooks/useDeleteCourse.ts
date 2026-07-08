import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useHttp from "./useHttp";

interface WithId {
  id: number;
}

export default function useDeleteCourse<T extends WithId>(
  onRefreshCourses: () => void,
) {
  const [showModal, setShowModal] = useState<T | null>(null);
  const { sendRequest, error } = useHttp();

  const handleShowModal = (course: T) => {
    setShowModal(course);
  };

  const handleCloseModal = () => {
    setShowModal(null);
  };

  const handleDeleteCourse = async () => {
    if (showModal) {
      const applyData = (data: { success: boolean; message: string }) => {
        if (data.success) toast.success(data.message);
        setShowModal(null);
        onRefreshCourses();
      };
      sendRequest(
        { path: `/course/delete-course/${showModal.id}`, method: "delete" },
        applyData as (data: Record<string, unknown>) => void,
      );
    }
  };

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  return {
    showModal,
    handleShowModal,
    handleCloseModal,
    handleDeleteCourse,
  };
}
