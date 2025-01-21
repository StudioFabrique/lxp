import ImageHeader from "../../components/image-header";
import HeaderMenu from "../../components/UI/header-menu";
import { Fragment } from "react";
import Progression from "../../components/lessons-preview/progression/progression";
import Loader from "../../components/UI/loader";
import ProgressBar from "../../components/lessons-preview/progress-bar";
import Objectifs from "../../components/lessons-preview/module-data/objectifs";
import Contacts from "../../components/lessons-preview/module-data/contacts";
import PreviewLesson from "../../components/lessons-preview/preview-lesson/preview-lesson";
import Lesson from "../../utils/interfaces/lesson";
import Tags from "../../components/lessons-preview/module-data/tags";
import useCoursesPreview from "./hooks/use-lessons-preview";

/**
 * Aperçu de tous les cours d'un module destiné à l'apprenant
 */
const CoursesPreview = () => {
  // custom hook
  const {
    moduleData,
    setModuleData,
    selectedLesson,
    setSelectedLesson,
    isLoading,
  } = useCoursesPreview();

  return isLoading ? (
    <Loader />
  ) : (
    moduleData && (
      <div className="px-8 p-4">
        <div className="w-full">
          <ImageHeader
            imageUrl={`data:image/jpeg;base64,${moduleData.image}`}
            title={moduleData.title}
            subTitle={`${moduleData.parcours} > Module`}
            children={[
              <Fragment key="fragment" />,
              <HeaderMenu key="header" />,
            ]}
          />
        </div>

        <div className="mt-5 max-xl:flex max-xl:flex-col-reverse xl:grid xl:grid-cols-4 gap-5 w-full">
          <Progression
            courses={moduleData.courses}
            selectedLesson={selectedLesson}
            setSelectedLesson={setSelectedLesson}
          />
          <div className="flex flex-col gap-5 xl:col-span-3">
            <ProgressBar courses={moduleData.courses} />
            {selectedLesson ? (
              <PreviewLesson
                selectedLesson={selectedLesson}
                lessons={([] as Lesson[]).concat(
                  ...moduleData.courses.map((course) => course.lessons),
                )}
                setSelectedLesson={setSelectedLesson}
                setModuleData={setModuleData}
              />
            ) : (
              <>
                <Objectifs objectives={moduleData.bonusSkills} />
                <div className="grid grid-cols-2 gap-5">
                  <Contacts contacts={moduleData.contacts} />
                  <Tags tags={moduleData.tags ?? []} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default CoursesPreview;
