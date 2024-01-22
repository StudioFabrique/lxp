/* eslint-disable @typescript-eslint/no-explicit-any */
import FadeWrapper from "../../components/UI/fade-wrapper/fade-wrapper";
import ImageHeader from "../../components/image-header";
import HeaderMenu from "../../components/UI/header-menu";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useHttp from "../../hooks/use-http";
import Progression from "../../components/module-view-from-parcours/progression/progression";
import Loader from "../../components/UI/loader";
import ProgressBar from "../../components/module-view-from-parcours/progress-bar";
import Objectifs from "../../components/module-view-from-parcours/objectifs";
import Wrapper from "../../components/UI/wrapper/wrapper.component";
import Contacts from "../../components/module-view-from-parcours/contacts";
import Module from "../../utils/interfaces/module";
import PreviewLesson from "../../components/module-view-from-parcours/preview-lesson/preview-lesson";
import Lesson from "../../utils/interfaces/lesson";
import Tags from "../../components/module-view-from-parcours/tags";

/**
 * Aperçu du module du point de vue de l'apprenant
 */
const ModuleViewFromParcours = () => {
  const { sendRequest, isLoading } = useHttp(true);
  const { moduleId } = useParams();

  const [moduleData, setModuleData] = useState<any | null>(null);

  const [selectedLesson, setSelectedLesson] = useState<Lesson | undefined>();

  useEffect(() => {
    const applyData = (data: { data: Module }) => {
      setModuleData(data.data);
    };

    sendRequest(
      { path: `/modules/detail/${moduleId}`, method: "get" },
      applyData
    );
  }, [moduleId, sendRequest]);

  return isLoading ? (
    <Loader />
  ) : (
    moduleData && (
      <div className="px-8 p-4">
        <FadeWrapper>
          <div className="w-full">
            <ImageHeader
              imageUrl={`data:image/jpeg;base64,${moduleData.image}`}
              title={moduleData.title}
              subTitle={`${moduleData.parcours} > Module`}
              children={[<></>, <HeaderMenu />]}
            />
          </div>

          <div className="mt-5 grid grid-cols-4 gap-5 w-full">
            <Progression
              courses={moduleData.courses}
              selectedLesson={selectedLesson}
              setSelectedLesson={setSelectedLesson}
            />
            <div className="flex flex-col gap-5 col-span-3">
              <ProgressBar courses={moduleData.courses} />
              {selectedLesson ? (
                <PreviewLesson selectedLessonId={selectedLesson.id} />
              ) : (
                <>
                  <Objectifs objectives={moduleData.bonusSkills} />
                  <div className="grid grid-cols-2 gap-5">
                    <Contacts contacts={moduleData.contacts} />
                    <Tags tags={moduleData.tags ?? []} />
                    <Wrapper>
                      <div></div>
                    </Wrapper>
                  </div>
                  <Wrapper>
                    <div></div>
                  </Wrapper>
                </>
              )}
            </div>
          </div>
        </FadeWrapper>
      </div>
    )
  );
};

export default ModuleViewFromParcours;
