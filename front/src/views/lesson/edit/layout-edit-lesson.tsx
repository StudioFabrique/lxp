/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
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

  // retourne une leçon et la stock dans l'état partagé
  useEffect(() => {
    const applyData = (data: Lesson) => {
      dispatch(lessonActions.initLesson(data));
    };
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
    }
  }, [error]);

  console.log({ lesson });

  // supprimer les éléments du state global lorsque le composant est "démonté"
  useEffect(() => {
    return () => {
      dispatch(lessonActions.resetCurrentType());
      dispatch(lessonActions.resetLesson());
    };
  }, [dispatch]);

  return (
    <div className="w-full h-full flex flex-col justify-start items-center py-2">
      <FadeWrapper>
        <div className="w-full h-full flex flex-col items-center gap-y-4">
          <div className="w-full flex flex-col items-center gap-y-4">
            {lesson &&
            lesson !== undefined &&
            lesson.title &&
            lesson.course &&
            lesson.course.title ? (
              <ImageHeader
                title={lesson.title}
                subTitle={lesson.course.title}
                imageUrl={lesson.course.image ?? books}
              >
                <div className="w-10 h-10 text-white">
                  <DocDuplicateIcon />
                </div>
                <></>
              </ImageHeader>
            ) : null}
          </div>
          {lesson && lesson !== undefined ? (
            <div className="w-full 2xl:w-4/6 mt-8 flex flex-col items-center">
              <Outlet />
            </div>
          ) : (
            <Loader />
          )}
        </div>
      </FadeWrapper>
    </div>
  );
}
