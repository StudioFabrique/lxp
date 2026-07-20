import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router";
import { normalizeImageSource } from "../../../utils/images/image-source";
import defaultImage from "../../../../src/assets/images/module-default.jpg";
import FadeWrapper from "../../../components/wrappers/FadeWrapper";
import Loader from "../../../components/loaders/Loader";
import BookIcon from "../../../../src/components/UI/svg/book-icon";
import EditModuleCourse from "../../../components/edit-module/edit-module-course";
import EditModuleInfos from "../../../components/edit-module/edit-module-infos";
import EditModuleSkills from "../../../components/edit-module/edit-module-skills";
import ImageHeader from "../../../../src/components/image-header/image-header";
import { autoSubmitTimer } from "../../../config/auto-submit-timer";
import apiClient from "../../../lib/axios";
import Contact from "../../../../src/utils/interfaces/contact";
import Course from "../../../../src/utils/interfaces/course";
import Skill from "../../../../src/utils/interfaces/skill";

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
  const [error, setError] = useState("");
  const [submit, setSubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState(false);

  // retourne les informations d'un module
  const fetchModule = useCallback(() => {
    apiClient
      .get(`/modules/detail/${moduleId}`)
      .then((res) => {
        const data = res.data as { data: ModuleDetail; message: string };
        setModule(data.data);
        setLoading(false);
      })
      .catch((err) => {
        const message =
          err?.response?.data?.message ?? "Erreur inconnue";
        setError(message);
      });
  }, [moduleId]);

  // met à jour l'ordre dans lequel les cours sont affichés dans la bdd
  const handleReorderCourses = useCallback(() => {
    setUpdating(true);
    apiClient
      .put(`/course/reorder/${moduleId}`, module?.courses.map((item) => item.id))
      .then(() => {
        fetchModule();
        setUpdating(false);
        setSuccess(true);
      })
      .catch((err) => {
        const message =
          err?.response?.data?.message ?? "Erreur inconnue";
        setError(message);
      });
    setSubmit(false);
  }, [moduleId, module?.courses, fetchModule]);

  const handleUpdateCoursesList = (updatedCourses: Course[]) => {
    setModule((prevModule) => ({ ...prevModule!, courses: updatedCourses }));
  };

  // debounce pour envoyer la requête de mise à jour des informations du module
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

  // debounce pour la confirmation du succes de la mise à jour d'un module
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
    <div className="w-full h-full flex flex-col justify-start items-center p2-8 py-2">
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
                  imageUrl={
                    module.image
                      ? normalizeImageSource(module.image)
                      : defaultImage
                  }
                >
                  <div className="w-12 h-12 text-white">
                    <BookIcon />
                  </div>
                  <></>
                </ImageHeader>
              ) : null}
              {/* Etapes du parcours */}
            </div>
            {module ? (
              <>
                <section className="w-full xl:w-4/6 grid grid-cols-1 lg:grid-cols-2 gap-4 my-4">
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
                <section className="w-full xl:w-4/6">
                  <EditModuleCourse
                    updating={updating}
                    success={success}
                    courses={module.courses}
                    onSetSubmit={setSubmit}
                    onUpdateCourses={handleUpdateCoursesList}
                    onRefreshModule={fetchModule}
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
