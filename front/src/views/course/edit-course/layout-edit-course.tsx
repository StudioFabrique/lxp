import { useCallback, useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import ImageHeader from "../../../components/image-header/image-header";
import useHttp from "../../../hooks/use-http";
import FadeWrapper from "../../../components/UI/fade-wrapper/fade-wrapper";
import { courseInfosAction } from "../../../store/redux-toolkit/course/course-infos";
import formatCourseFromHttp from "../../../helpers/course/course-infos-from-http";
import Course from "../../../utils/interfaces/course";
import Loader from "../../../components/UI/loader";

const LayoutCourseEdit = () => {
  const { sendRequest, error } = useHttp();
  const { courseId } = useParams();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const course = useSelector(
    (state: any) => state.courseInfos.course
  ) as Course;

  /**
   * mise à jour de l'image du cours dans la bdd
   */
  const updateImage = useCallback(
    (image: File) => {
      const formData = new FormData();
      formData.append("courseId", courseId!);
      formData.append("image", image);
      const processData = (_data: any) => {};
      sendRequest(
        {
          path: "/course/image",
          method: "put",
          body: formData,
        },
        processData
      );
    },
    [courseId, sendRequest]
  );

  /**
   * retourne les informations de base d'un parcours et les
   * stock dans un state global
   */
  useEffect(() => {
    const applyData = (data: any) => {
      dispatch(courseInfosAction.setCourse(formatCourseFromHttp(data)));
      setLoading(false);
    };
    setLoading(true);
    sendRequest(
      {
        path: `/course/infos/${courseId}`,
      },
      applyData
    );
    return () => {
      dispatch(courseInfosAction.resetCourse());
    };
  }, [courseId, dispatch, sendRequest]);

  /**
   * gestion des erreurs HTTP
   */
  useEffect(() => {
    if (error.length > 0) {
      toast.error(error);
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
              {course && course.title && course.module.title ? (
                <ImageHeader
                  defaultImage="/images/parcours-default.jpg"
                  title={course.title}
                  image={course.image ?? undefined}
                  parentTitle={course.module.title}
                  onUpdateImage={updateImage}
                />
              ) : null}
              {/* Etapes du parcours */}
            </div>
            {course ? <Outlet /> : <Loader />}
          </div>
        </FadeWrapper>
      )}
    </div>
  );
};

export default LayoutCourseEdit;
