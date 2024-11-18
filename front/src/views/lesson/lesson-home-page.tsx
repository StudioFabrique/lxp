import { useCallback, useEffect, useState } from "react";

import Lesson from "../../utils/interfaces/lesson";
import useHttp from "../../hooks/use-http";
import LessonHome from "../../components/lesson-home/lesson-home";
import useLessonHTTP from "../../hooks/use-lesson-http";
import toast from "react-hot-toast";
import Modal from "../../components/UI/modal/modal";
import Header from "../../components/UI/header";
import { PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Page principale de gestion des leçons
 * Permet d'afficher la liste des leçons, d'en créer, modifier et supprimer
 */
export default function LessonHomePage() {
  // États pour gérer la liste des leçons et la suppression
  const [lessonsList, setLessonsList] = useState<Lesson[] | null>(null);
  const [lessonToDelete, setLessonToDelete] = useState<number | null>(null);

  // Hooks personnalisés pour les requêtes HTTP
  const { sendRequest, isLoading } = useHttp();
  const { deleteLesson } = useLessonHTTP();

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
    const data = await deleteLesson(lessonToDelete!);
    if (data.success) {
      toast.success(data.message);
      setLessonToDelete(null);
      fetchData();
    }
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

  return (
    <main className="w-full flex flex-col items-center py-8 gap-8">
      {/* En-tête de la page */}
      <section className="w-5/6 flex flex-col items-center">
        <Header
          title="Liste des leçons"
          description="Gérer toutes les leçons qui  vous sont attribuées."
        ></Header>
      </section>

      {/* Bouton de création de leçon */}
      <section className="w-5/6 flex justify-end">
        <Link className="btn btn-primary" to="add">
          <PlusCircle /> Créer une leçon
        </Link>
      </section>

      {/* Liste des leçons */}
      <section className="w-5/6">
        {lessonsList && lessonsList.length > 0 ? (
          <LessonHome lessonsList={lessonsList} onDelete={setDeletion} />
        ) : (
          <p className="w-5/6 text-primary">Aucune leçon trouvée.</p>
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
            Attention la leçon et les ressources qui lui sont associées seront
            définitivement supprimées.
          </Modal>
        ) : null}
      </section>
    </main>
  );
}
