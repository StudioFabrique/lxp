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

export default function LayoutEditLesson() {
  const { lessonId } = useParams();
  const { sendRequest, error } = useHttp();
  const [loading, setLoading] = useState(false);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [activities, setActivities] = useState<number[]>([1]);

  // retounr les détails d'une leçon
  useEffect(() => {
    const applyData = (data: Lesson) => {
      setLesson(data);
      setLoading(false);
    };
    setLoading(true);
    sendRequest(
      {
        path: `/lesson/${lessonId}`,
      },
      applyData
    );
  }, [lessonId, sendRequest]);

  // gestion erreurs HTTP
  useEffect(() => {
    if (error.length > 0) {
      toast.error(error);
      setLoading(false);
    }
  }, [error]);

  return (
    <div className="w-full h-full flex flex-col justify-start items-center px-8 py-2">
      {loading ? (
        <Loader />
      ) : (
        <FadeWrapper>
          <div className="w-full h-full flex flex-col items-center gap-y-8">
            <div className="w-full flex flex-col items-center gap-y-8">
              {lesson &&
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
            {lesson ? (
              <div className="w-full 2xl:w-4/6 mt-8 flex flex-col items-center">
                <div className="w-full flex justify-end">
                  <HeaderButton
                    lessonId={+lessonId!}
                    showPreview={activities.length > 0}
                    onPublish={() => {}}
                  />
                </div>
                <AddBlock />
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
