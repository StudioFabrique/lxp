import { useEffect } from "react";
import Loader from "../../../../src.legacy/components/UI/loader";
import FadeWrapper from "../../../../src.legacy/components/UI/fade-wrapper/fade-wrapper";
import useHttp from "../../../../src/hooks/useHttp";
import Lesson from "../../../../src/utils/interfaces/lesson";
import { Outlet, useParams } from "react-router";
import ImageHeader from "../../../../src.legacy/components/image-header";
import toast from "react-hot-toast";
import books from "../../../../src.legacy/assets/images/bookshelf.jpg";
import DocDuplicateIcon from "../../../../src.legacy/components/UI/svg/doc-duplicate-icon";
import { useLessonSelector, useLessonDispatch } from "../store/LessonContext";

export default function LayoutEditLesson() {
  const dispatch = useLessonDispatch();
  const lesson = useLessonSelector((state) => state.lesson);
  const { lessonId } = useParams();
  const { sendRequest, error } = useHttp();

  useEffect(() => {
    const applyData = (data: Lesson) => {
      dispatch({ type: "INIT_LESSON", payload: data });
    };
    sendRequest(
      {
        path: `/lesson/${lessonId}`,
      },
      applyData
    );
  }, [lessonId, dispatch, sendRequest]);

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
