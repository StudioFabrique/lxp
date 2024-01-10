import { useEffect, useState } from "react";
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
import Wrapper from "../../../components/UI/wrapper/wrapper.component";

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
  const { sendRequest, isLoading, error } = useHttp();

  useEffect(() => {
    const applyData = (data: ModuleDetail) => {
      setModule(data);
    };
    sendRequest(
      {
        path: `/modules/detail/${moduleId}`,
      },
      applyData
    );
  }, [moduleId, sendRequest]);

  return (
    <div className="w-full h-full flex flex-col justify-start items-center px-8 py-2">
      {isLoading ? (
        <Loader />
      ) : (
        <FadeWrapper>
          <div className="w-full h-full flex flex-col gap-y-8">
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
              <section className="w-5/6 flex justify-center bg-pink-400">
                <article className="w-4/6 grid grid-cols-2 gap-16">
                  <Wrapper>
                    <EditModuleInfos
                      minDate={module.minDate}
                      maxDate={module.maxDate}
                      description={module.description}
                      contacts={module.contacts}
                    />
                  </Wrapper>
                </article>
                <article className="w-4/6 bg-orange-500">toto</article>
              </section>
            ) : (
              <Loader />
            )}
          </div>
        </FadeWrapper>
      )}
    </div>
  );
}
