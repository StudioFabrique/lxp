import { useCallback, useEffect, useState } from "react";

import useHttp from "../../hooks/use-http";
import LessonHome from "../../components/lesson-home/lesson-home";
import toast from "react-hot-toast";
import Modal from "../../components/UI/modal/modal";
import Lesson from "../../utils/interfaces/lesson";
import ListHeader from "../../components/UI/list-header";
import LessonHeader from "../../components/lesson-home/lesson-header";
import ElementNotFound from "../../components/UI/element-not-found";
import Wrapper from "../../components/UI/wrapper/wrapper.component";

/**
 * Page principale de gestion des leçons
 * Permet d'afficher la liste des leçons, d'en créer, modifier et supprimer
 */
export default function LessonHomePage() {
  // États pour gérer la liste des leçons et la suppression
  const [lessonsList, setLessonsList] = useState<Lesson[] | null>(null);
  const [lessonToDelete, setLessonToDelete] = useState<number | null>(null);

  // Hooks personnalisés pour les requêtes HTTP
  const { sendRequest, error, isLoading } = useHttp();

  /**
   * Marque une leçon pour suppression
   * @param id Identifiant de la leçon à supprimer
   */
  const setDeletion = (id: number) => {
    setLessonToDelete(id);
  };

  /**
   * Permet de supprimer une leçon définitivement ainsi que les activités associées
   */
  const handleDeleteLesson = async () => {
    const applyData = (data: { success: boolean; message: string }) => {
      if (data.success) {
        toast.success(data.message);
        setLessonToDelete(null);
        fetchData();
      }
    };
    sendRequest(
      { path: `/lesson/${lessonToDelete}`, method: "delete" },
      applyData
    );
  };

  /**
   * Récupère la liste des leçons depuis le backend
   */
  const fetchData = useCallback(() => {
    const applyData = (data: {
      success: boolean;
      message: string;
      lessons: Lesson[];
    }) => {
      if (data.success) {
        setLessonsList(data.lessons);
      }
    };
    sendRequest(
      {
        path: "/lesson",
      },
      applyData
    );
  }, [sendRequest]);

  // Chargement initial des leçons
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Gestion des erreurs HTTP
  useEffect(() => {
    if (error.length > 0) {
      toast.error(error);
      if (lessonToDelete) setLessonToDelete(null);
    }
  }, [error, lessonToDelete]);

  return (
    <main className="min-h-screen w-full flex justify-center">
      <div>
        <ListHeader>
          {/* En-tête de la page */}
          <LessonHeader />

          {/* Liste des leçons */}
          <section>
            {lessonsList && lessonsList.length > 0 ? (
              <Wrapper>
                <LessonHome lessonsList={lessonsList} onDelete={setDeletion} />
              </Wrapper>
            ) : (
              <ElementNotFound message={"Aucune leçon trouvée."} />
            )}
          </section>

          {/* Modal de confirmation de suppression */}
          <section>
            {lessonToDelete ? (
              <Modal
                onLeftClick={() => setLessonToDelete(null)}
                onRightClick={handleDeleteLesson}
                title="Supprimer une leçon"
                isSubmitting={isLoading}
                leftLabel="Annuler"
                rightLabel="Confirmer"
              >
                Attention la leçon et les ressources qui lui sont associées
                seront définitivement supprimées.
              </Modal>
            ) : null}
          </section>
        </ListHeader>
      </div>
    </main>
  );
}
