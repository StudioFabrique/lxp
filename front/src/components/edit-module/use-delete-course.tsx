import { useState } from "react";
import Course from "../../utils/interfaces/course";
import useHttp from "../../hooks/use-http";
import toast from "react-hot-toast";

export default function useDeleteCourse(onRefreshModule: () => void) {
  const [showModal, setShowModal] = useState<Course | null>(null);
  const { sendRequest, error } = useHttp();

  /**
   * affecte la valeur d'un cours dans un state, cela va déclencher l'affichage d'une
   * fenêtre modale pour confirmer la suppression d'un cours
   * @param course Course
   */
  const handleShowModal = (course: Course) => {
    setShowModal(course);
  };

  /**
   * ferme la fenêtre modal de confirmation de suppression d'un cours
   */
  const handleCloseModal = () => {
    setShowModal(null);
  };

  /**
   * envoie une requête à l'api pour supprimer un cours
   */
  const handleDeleteCourse = async () => {
    if (showModal) {
      const applyData = (data: { success: boolean; message: string }) => {
        if (data.success) toast.success(data.message);
        setShowModal(null);
        onRefreshModule();
      };
      sendRequest(
        { path: `/course/delete-course/${showModal.id}`, method: "delete" },
        applyData,
      );
    }
  };

  return {
    showModal,
    error,
    handleShowModal,
    handleCloseModal,
    handleDeleteCourse,
  };
}
