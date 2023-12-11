import { useEffect, useState } from "react";
import Loader from "../../../components/UI/loader";
import FadeWrapper from "../../../components/UI/fade-wrapper/fade-wrapper";
import useHttp from "../../../hooks/use-http";
import Lesson from "../../../utils/interfaces/lesson";
import { Outlet, useParams } from "react-router-dom";
import BookIcon from "../../../components/UI/svg/book-icon";
import ImageHeader from "../../../components/image-header";
import toast from "react-hot-toast";

export default function LayoutEditLesson() {
  const { lessonId } = useParams();
  const { sendRequest, error } = useHttp();
  const [loading, setLoading] = useState(false);
  const [lesson, setLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    const applyData = (data: Lesson) => {
      setLesson(data);
      setLoading(false);
    };
    setLoading(true);
    sendRequest(
      {
        path: `lesson/${lessonId}`,
      },
      applyData
    );
  }, [lessonId, sendRequest]);

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
          <div className="w-full h-full flex flex-col gap-y-8">
            <div className="w-full flex flex-col items-center gap-y-8">
              {lesson &&
              lesson.title &&
              lesson.courses &&
              lesson.courses[0].title ? (
                <ImageHeader
                  title={lesson.courses[0].title}
                  subTitle={lesson.title}
                  imageUrl={lesson.courses[0].image!}
                >
                  <BookIcon />
                  <></>
                </ImageHeader>
              ) : null}
              {/* Etapes du parcours */}
            </div>
            {lesson ? <Outlet /> : <Loader />}
          </div>
        </FadeWrapper>
      )}
    </div>
  );
}
