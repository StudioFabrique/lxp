import Progression from "../../components/lessons-preview/progression/progression";
import Loader from "../../components/UI/loader";
import ProgressBar from "../../components/lessons-preview/progress-bar";
import PreviewLesson from "../../components/lessons-preview/preview-lesson/preview-lesson";
import Lesson from "../../utils/interfaces/lesson";
import useCoursesPreview from "./hooks/use-lessons-preview";
import LessonsPreviewHeader from "../../components/lessons-preview/lessons-preview-header";
import ModuleData from "../../components/lessons-preview/module-data/module-data";
import LessonsPreviewWrapper from "../../components/lessons-preview/lessons-preview-wrapper";

/**
 * Aperçu de tous les cours et leçons d'un module destiné à l'apprenant
 */
const LessonsPreview = () => {
  // custom hook
  const {
    moduleData,
    setModuleData,
    selectedLesson,
    setSelectedLesson,
    isLoading,
  } = useCoursesPreview();

  return isLoading || !moduleData ? (
    <Loader />
  ) : (
    <LessonsPreviewWrapper selectedLesson={selectedLesson}>
      {[
        <LessonsPreviewHeader key="header" moduleData={moduleData} />,
        <Progression
          key="progession-side"
          courses={moduleData.courses}
          selectedLesson={selectedLesson}
          setSelectedLesson={setSelectedLesson}
        />,
        <ProgressBar key="top-progress-bar" courses={moduleData.courses} />,
        <PreviewLesson
          key="previewLesson"
          selectedLesson={selectedLesson as Lesson}
          lessons={moduleData.courses.flatMap((course) => course.lessons)}
          setSelectedLesson={setSelectedLesson}
          setModuleData={setModuleData}
        />,
        <ModuleData key="moduleData" moduleData={moduleData} />,
      ]}
    </LessonsPreviewWrapper>
  );
};

export default LessonsPreview;
