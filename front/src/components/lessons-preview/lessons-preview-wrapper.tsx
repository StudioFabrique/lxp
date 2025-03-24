import { Dispatch, PropsWithChildren, SetStateAction } from "react";
import Lesson from "../../utils/interfaces/lesson";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { motion } from "framer-motion";

type LessonsPreviewWrapperProps = {
  selectedLesson?: Lesson;
  isPanelClosed?: boolean;
  setPanelClosed: Dispatch<SetStateAction<boolean>>;
};

/**
 * Ce composant sert de conteneur (wrapper) structurel pour le composant LessonsPreview.
 * Il encapsule la logique de présentation et la mise en page des aperçus de leçons.
 */
const LessonsPreviewWrapper = ({
  selectedLesson,
  isPanelClosed = false,
  setPanelClosed,
  children,
}: PropsWithChildren<LessonsPreviewWrapperProps>) => {
  const [header, progessionSide, topProgressBar, previewLesson, moduleData] =
    children as React.ReactNode[];

  const handleTogglePanel = () => {
    setPanelClosed(!isPanelClosed);
  };

  return (
    <div className="px-8 p-4 w-full overflow-hidden">
      {header}

      <div className="mt-5 max-xl:flex max-xl:flex-col-reverse xl:grid xl:grid-cols-4 gap-5 w-full">
        {!isPanelClosed && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {progessionSide}
          </motion.div>
        )}
        <div
          className={`flex flex-col gap-5 ${isPanelClosed ? "xl:col-span-4" : "xl:col-span-3"}`}
        >
          <div className="flex gap-5">
            <button
              onClick={handleTogglePanel}
              className="btn w-fit hover:bg-primary hover:text-base-100"
            >
              {isPanelClosed ? (
                <div
                  data-tip="Agrandir le panneau latéral"
                  className="tooltip tooltip-right"
                >
                  <PanelLeftOpen className="w-6 h-6" />
                </div>
              ) : (
                <div
                  data-tip="Réduire le panneau latéral"
                  className="tooltip tooltip-right"
                >
                  <PanelLeftClose className="w-6 h-6" />
                </div>
              )}
            </button>
            <span className="w-full bg-secondary/20 rounded-lg h-full px-2">
              {topProgressBar}
            </span>
          </div>

          {selectedLesson ? previewLesson : moduleData}
        </div>
      </div>
    </div>
  );
};

export default LessonsPreviewWrapper;
