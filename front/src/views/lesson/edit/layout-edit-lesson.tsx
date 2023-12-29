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
import HeaderButton from "./header-buttons";
import AddBlock from "../../../components/edit-lesson/add-block";
import { useDispatch, useSelector } from "react-redux";
import { lessonActions } from "../../../store/redux-toolkit/lesson/lesson";

export default function LayoutEditLesson() {
  const dispatch = useDispatch();
  const lesson = useSelector((state: any) => state.lesson.lesson);
  const { lessonId } = useParams();
  const { sendRequest, error } = useHttp();
  const [loading, setLoading] = useState(false);
  const [activities] = useState<number[]>([1]);

  // retourne une leçon et la stock dans l'état partagé
  useEffect(() => {
    const applyData = (data: Lesson) => {
      dispatch(lessonActions.initLesson(data));
      setLoading(false);
    };
    setLoading(true);
    sendRequest(
      {
        path: `/lesson/${lessonId}`,
      },
      applyData
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
  useEffect(() => {
    return () => {
      dispatch(lessonActions.resetCurrentType());
      dispatch(lessonActions.resetLesson());
    };
  }, [dispatch]);

  /**
   * met à jour le type de la nouvelle activité dans le state global
   * @param activityType string
   */
  const handleClickActivityType = (activityType: string) => {
    dispatch(lessonActions.setCurrentType(activityType));
  };

  return (
    <div className="w-full h-full flex flex-col justify-start items-center px-8 py-2">
      {loading ? (
        <Loader />
      ) : (
        <FadeWrapper>
          <div className="w-full h-full flex flex-col items-center gap-y-4">
            <div className="w-full flex flex-col items-center gap-y-4">
              {lesson &&
              lesson !== undefined &&
              lesson.title &&
              lesson.course &&
              lesson.course.title ? (
                <ImageHeader
                  title={lesson.course.title}
                  subTitle={lesson.title}
                  imageUrl={lesson.course.image ?? books}
                >
                  <DocDuplicateIcon />
                  <></>
                </ImageHeader>
              ) : null}
            </div>
            {lesson && lesson !== undefined ? (
              <div className="w-full 2xl:w-4/6 mt-8 flex flex-col items-center">
                <div className="w-full flex justify-end">
                  <HeaderButton
                    lessonId={+lessonId!}
                    showPreview={activities.length > 0}
                    //onPublish={() => {}}
                  />
                </div>
                <h2 className="text-xl font-bold text-primary mb-2">
                  Ajouter un bloc
                </h2>
                <AddBlock onActivityType={handleClickActivityType} />
                <Outlet />
              </div>
            ) : (
              <Loader />
            )}
          </div>
        </FadeWrapper>
      )}
    </div>
  );
}
