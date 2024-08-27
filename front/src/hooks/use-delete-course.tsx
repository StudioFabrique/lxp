/**
Custom Hook qui gère la logique de suppression d'un cours
Le type T est soit le type Course ou CustomCourse implémenté dans
l'interface de gestion des cours
*/

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useHttp from "./use-http";

interface WithId {
  id: number;
}

export default function useDeleteCourse<T extends WithId>(
  onRefreshCourses: () => void,
) {
  const [showModal, setShowModal] = useState<T | null>(null);
  const { sendRequest, error } = useHttp();

  /**
   * affecte la valeur d'un cours dans un state, cela va déclencher l'affichage d'une
   * fenêtre modale pour confirmer la suppression d'un cours
   * @param course Course
   */
  const handleShowModal = (course: T) => {
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
        onRefreshCourses();
      };
      sendRequest(
        { path: `/course/delete-course/${showModal.id}`, method: "delete" },
        applyData,
      );
    }
  };

  //  affiche un toast avec le message d'erreur retourné par l'api
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
