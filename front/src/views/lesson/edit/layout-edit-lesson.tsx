/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import Loader from "../../../components/UI/loader";
import FadeWrapper from "../../../components/UI/fade-wrapper/fade-wrapper";
import useHttp from "../../../hooks/use-http";
import Lesson from "../../../utils/interfaces/lesson";
import { Outlet, useParams } from "react-router-dom";
import ImageHeader from "../../../components/image-header";
import toast from "react-hot-toast";
import books from "../../../assets/images/bookshelf.jpg";
import DocDuplicateIcon from "../../../components/UI/svg/doc-duplicate-icon";
import { useDispatch, useSelector } from "react-redux";
import { lessonActions } from "../../../store/redux-toolkit/lesson/lesson";

export default function LayoutEditLesson() {
  const dispatch = useDispatch();
  const lesson = useSelector((state: any) => state.lesson.lesson);
  const { lessonId } = useParams();
  const { sendRequest, error } = useHttp();
  const [loading, setLoading] = useState(false);
  console.log({ lesson });
  // retourne une leçon et la stock dans l'état partagé
  useEffect(() => {
    const applyData = (data: Lesson) => {
      dispatch(lessonActions.setLesson(data));
      setLoading(false);
    };
    setLoading(true);
    sendRequest(
      {
        path: `/lesson/${lessonId}`,
      },
      applyData,
    );
  }, [lessonId, dispatch, sendRequest]);

  // gestion erreurs HTTP
  useEffect(() => {
    if (error.length > 0) {
      toast.error(error);
      setLoading(false);
    }
  }, [error]);

  // supprimer les éléments du state global lorsque le composant est "démonté"
  // useEffect(() => {
  //   return () => {
  //     dispatch(lessonActions.resetCurrentType());
  //     dispatch(lessonActions.resetLesson());
  //   };
  // }, [dispatch]);

  return (
    <div className="py-2">
      {loading ? (
        <Loader />
      ) : (
        <main className="w-full flex flex-col gap-y-4">
          <FadeWrapper>
            <div className="w-full h-full flex flex-col items-start gap-y-4">
              <div className="w-full flex flex-col items-center gap-y-4">
                {lesson ? (
                  <ImageHeader
                    title={lesson.course.title}
                    subTitle={lesson.title}
                    imageUrl={lesson.course.image ?? books}
                  >
                    <div className="w-10 h-10 text-white">
                      <DocDuplicateIcon />
                    </div>
                    <></>
                  </ImageHeader>
                ) : null}
              </div>
            </div>
          </FadeWrapper>
          <Outlet />
        </main>
      )}
    </div>
  );
}
