import { PropsWithChildren } from "react";
import Lesson from "../../utils/interfaces/lesson";

type LessonsPreviewWrapperProps = {
  selectedLesson?: Lesson;
  isPanelClosed?: boolean;
};

/**
 * Ce composant sert de conteneur (wrapper) structurel pour le composant LessonsPreview.
 * Il encapsule la logique de présentation et la mise en page des aperçus de leçons.
 */
const LessonsPreviewWrapper = ({
  selectedLesson,
  isPanelClosed,
  children,
}: PropsWithChildren<LessonsPreviewWrapperProps>) => {
  const [header, progessionSide, topProgressBar, previewLesson, moduleData] =
    children as React.ReactNode[];

  return (
    <div className="px-8 p-4 w-full overflow-hidden">
      {header}

      <div className="mt-5 max-xl:flex max-xl:flex-col-reverse xl:grid xl:grid-cols-4 gap-5 w-full">
        {isPanelClosed ? null : progessionSide}
        <div
          className={`flex flex-col gap-5 ${isPanelClosed ? "xl:col-span-4" : "xl:col-span-3"}`}
        >
          {topProgressBar}
          {selectedLesson ? previewLesson : moduleData}
        </div>
      </div>
    </div>
  );
};

export default LessonsPreviewWrapper;
