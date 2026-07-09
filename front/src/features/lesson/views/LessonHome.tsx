import { useCallback, useEffect, useState } from "react";

import { lessonApi } from "../api/lesson.api";
import LessonHome from "../components/list/lesson-home";
import toast from "react-hot-toast";
import Modal from "../../../components/UI/modal/modal";
import Lesson from "../../../../src/utils/interfaces/lesson";
import ListHeader from "../../../components/UI/list-header";
import LessonHeader from "../components/list/lesson-header";
import ElementNotFound from "../../../components/UI/element-not-found";
import Wrapper from "../../../../src/components/wrappers/BoxWrapper";

export default function LessonHomePage() {
  const [lessonsList, setLessonsList] = useState<Lesson[] | null>(null);
  const [lessonToDelete, setLessonToDelete] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const setDeletion = (id: number) => {
    setLessonToDelete(id);
  };

  const handleDeleteLesson = async () => {
    lessonApi.mutations.deleteLesson(lessonToDelete!).then((data) => {
      if (data.success) {
        toast.success(data.message);
        setLessonToDelete(null);
        fetchData();
      }
    });
  };

  const fetchData = useCallback(() => {
    setIsLoading(true);
    lessonApi.queries
      .getAllLessons()
      .then((data) => {
        if (data.success) {
          setLessonsList(data.lessons);
        }
      })
      .catch((err: any) => {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Une erreur est survenue"
        );
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (error.length > 0) {
      toast.error(error);
      if (lessonToDelete) setLessonToDelete(null);
    }
  }, [error, lessonToDelete]);

  return (
    <ListHeader>
      <LessonHeader />

      <section className="w-full">
        {lessonsList && lessonsList.length > 0 ? (
          <Wrapper>
            <LessonHome lessonsList={lessonsList} onDelete={setDeletion} />
          </Wrapper>
        ) : (
          <ElementNotFound message={"Aucune leçon trouvée."} />
        )}
      </section>

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
    </ListHeader>
  );
}
