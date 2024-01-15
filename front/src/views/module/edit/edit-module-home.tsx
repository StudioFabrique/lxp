import { useCallback, useEffect, useState } from "react";
import Skill from "../../../utils/interfaces/skill";
import Contact from "../../../utils/interfaces/contact";
import Course from "../../../utils/interfaces/course";
import useHttp from "../../../hooks/use-http";
import FadeWrapper from "../../../components/UI/fade-wrapper/fade-wrapper";
import ImageHeader from "../../../components/image-header";
import Loader from "../../../components/UI/loader";
import BookIcon from "../../../components/UI/svg/book-icon";
import EditModuleInfos from "../../../components/edit-module/edit-module-infos";
import { useParams } from "react-router-dom";
import EditModuleSkills from "../../../components/edit-module/edit-module-skills";
import EditModuleCourse from "../../../components/edit-module/edit-module-course";
import toast from "react-hot-toast";
import { autoSubmitTimer } from "../../../config/auto-submit-timer";

interface ModuleDetail {
  id: number;
  title: string;
  description: string;
  image: string;
  duration: number;
  minDate: string;
  maxDate: string;
  parcours: string;
  bonusSkills: Skill[];
  contacts: Contact[];
  courses: Course[];
}

export default function EditModuleHome() {
  const { moduleId } = useParams();
  const [module, setModule] = useState<ModuleDetail | null>(null);
  const { sendRequest, error } = useHttp();
  const [submit, setSubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState(false);

  const fetchModule = useCallback(() => {
    const applyData = (data: ModuleDetail) => {
      setModule(data);
      setLoading(false);
    };
    sendRequest(
      {
        path: `/modules/detail/${moduleId}`,
      },
      applyData
    );
  }, [moduleId, sendRequest]);

  const handleReorderCourses = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const applyData = (data: any) => {
      console.log(data);
      fetchModule();
      setUpdating(false);
      setSuccess(true);
    };
    setUpdating(true);
    sendRequest(
      {
        path: `/course/reorder/${moduleId}`,
        method: "put",
        body: module?.courses.map((item) => item.id),
      },
      applyData
    );
    setSubmit(false);
  }, [moduleId, module?.courses, fetchModule, sendRequest]);

  const handleUpdateCoursesList = (updatedCourses: Course[]) => {
    setModule((prevModule) => ({ ...prevModule!, courses: updatedCourses }));
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (submit) {
      timer = setTimeout(() => {
        handleReorderCourses();
      }, autoSubmitTimer);
    }
    return () => clearTimeout(timer);
  }, [submit, handleReorderCourses]);

  useEffect(() => {
    setLoading(true);
    fetchModule();
  }, [fetchModule]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (success) {
      timer = setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [success]);

  useEffect(() => {
    if (error.length > 0) {
      toast.error(error);
      setUpdating(false);
      setLoading(false);
    }
  }, [error]);

  return (
    <div className="w-full h-full flex flex-col justify-start items-center px-8 py-2">
      {loading ? (
        <Loader />
      ) : (
        <FadeWrapper>
          <div className="w-full h-full flex flex-col items-center first-letter:gap-y-8">
            <div className="w-full flex flex-col items-center gap-y-8">
              {module ? (
                <ImageHeader
                  title={module.title}
                  subTitle={module.parcours}
                  imageUrl={`data:image/jpeg;base64,${module.image}`}
                >
                  <BookIcon />
                  <></>
                </ImageHeader>
              ) : null}
              {/* Etapes du parcours */}
            </div>
            {module ? (
              <>
                <section className="w-4/6 grid grid-cols-2 gap-4 my-4">
                  <article>
                    <EditModuleInfos
                      minDate={module.minDate}
                      maxDate={module.maxDate}
                      description={module.description}
                      contacts={module.contacts}
                    />
                  </article>
                  <article className="w-full">
                    <EditModuleSkills skills={module.bonusSkills} />
                  </article>
                </section>
                <section className="w-4/6">
                  <EditModuleCourse
                    updating={updating}
                    success={success}
                    courses={module.courses}
                    onSetSubmit={setSubmit}
                    onUpdateCourses={handleUpdateCoursesList}
                  />
                </section>
              </>
            ) : (
              <Loader />
            )}
          </div>
        </FadeWrapper>
      )}
    </div>
  );
}
