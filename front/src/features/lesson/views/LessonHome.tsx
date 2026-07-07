import { useCallback, useEffect, useState } from "react";

import useHttp from "../../../../src.legacy/hooks/use-http";
import LessonHome from "../components/list/lesson-home";
import toast from "react-hot-toast";
import Modal from "../../../../src.legacy/components/UI/modal/modal";
import Lesson from "../../../../src.legacy/utils/interfaces/lesson";
import ListHeader from "../../../../src.legacy/components/UI/list-header";
import LessonHeader from "../components/list/lesson-header";
import ElementNotFound from "../../../../src.legacy/components/UI/element-not-found";
import Wrapper from "../../../../src.legacy/components/UI/wrapper/wrapper.component";

export default function LessonHomePage() {
  const [lessonsList, setLessonsList] = useState<Lesson[] | null>(null);
  const [lessonToDelete, setLessonToDelete] = useState<number | null>(null);

  const { sendRequest, error, isLoading } = useHttp();

  const setDeletion = (id: number) => {
    setLessonToDelete(id);
  };

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
