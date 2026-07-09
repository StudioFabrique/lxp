import { useEffect, useState } from "react";
import Loader from "../../../../src/components/loaders/Loader";
import FadeWrapper from "../../../../src/components/wrappers/FadeWrapper";
import { lessonApi } from "../api/lesson.api";
import Lesson from "../../../../src/utils/interfaces/lesson";
import { Outlet, useParams } from "react-router";
import ImageHeader from "../../../../src/components/image-header/image-header";
import toast from "react-hot-toast";
import books from "../../../../src/assets/images/bookshelf.jpg";
import DocDuplicateIcon from "../../../../src/components/UI/svg/doc-duplicate-icon";
import { useLessonSelector, useLessonDispatch } from "../store/LessonContext";

export default function LayoutEditLesson() {
  const dispatch = useLessonDispatch();
  const lesson = useLessonSelector((state) => state.lesson);
  const { lessonId } = useParams();
  const [error, setError] = useState("");

  useEffect(() => {
    lessonApi.queries.getLessonById(lessonId!).then((data: Lesson) => {
      dispatch({ type: "INIT_LESSON", payload: data });
    }).catch((err: any) => {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Une erreur est survenue",
      );
    });
  }, [lessonId, dispatch]);

  useEffect(() => {
    if (error.length > 0) {
      toast.error(error);
    }
  }, [error]);

  console.log({ lesson });

  useEffect(() => {
    return () => {
      dispatch({ type: "RESET_CURRENT_TYPE" });
      dispatch({ type: "RESET_LESSON" });
    };
  }, [dispatch]);

  return (
    <div className="w-full h-full flex flex-col justify-start items-center">
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
            <div className="w-full flex flex-col items-center">
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
