import { useCallback, useEffect, useState } from "react";

import Lesson from "../../utils/interfaces/lesson";
import useHttp from "../../hooks/use-http";
import LessonHome from "../../components/lesson-home/lesson-home";
import useLessonHTTP from "../../hooks/use-lesson-http";
import toast from "react-hot-toast";
import Modal from "../../components/UI/modal/modal";

export default function LessonHomePage() {
  const [lessonsList, setLessonsList] = useState<Lesson[] | null>(null);
  const [lessonToDelete, setLessonToDelete] = useState<number | null>(null);
  const { sendRequest, isLoading } = useHttp();
  const { deleteLesson } = useLessonHTTP();

  const setDeletion = (id: number) => {
    setLessonToDelete(id);
  };

  /**
   * Permet de supprimer une leçon définitivement ainsi que les activités associées
   * @param lesson Lesson
   */
  const handleDeleteLesson = async () => {
    const data = await deleteLesson(lessonToDelete!);
    if (data.success) {
      toast.success(data.message);
      setLessonToDelete(null);
      fetchData();
    }
  };

  // retourne la liste des leçons depuis le backend
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

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!lessonsList || lessonsList.length === 0) {
    return <p>Aucune leçon n'a été trouvée.</p>;
  }

  return (
    <main className="w-full flex flex-col gap-y-4">
      <LessonHome lessonsList={lessonsList} onDelete={setDeletion} />{" "}
      {lessonToDelete ? (
        <Modal
          onLeftClick={() => setLessonToDelete(null)}
          onRightClick={handleDeleteLesson}
          title="Supprimer une leçon"
          isSubmitting={isLoading}
          message="Attention la leçon et les ressources qui lui sont associées seront définitivement supprimées."
          leftLabel="Annuler"
          rightLabel="Confirmer"
        />
      ) : null}
    </main>
  );
}
