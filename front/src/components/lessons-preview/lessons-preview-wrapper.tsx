import { Dispatch, PropsWithChildren, SetStateAction } from "react";
import Lesson from "../../utils/interfaces/lesson";
import {
  ClipboardList,
  Edit,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { motion } from "framer-motion";
import Can from "../UI/can/can.component";
import { Link } from "react-router-dom";

type LessonsPreviewWrapperProps = {
  selectedLesson?: Lesson;
  isPanelClosed?: boolean;
  setPanelClosed: Dispatch<SetStateAction<boolean>>;
  lessonHasActivities: boolean;
};

/**
 * Ce composant sert de conteneur (wrapper) structurel pour le composant LessonsPreview.
 * Il encapsule la logique de présentation et la mise en page des aperçus de leçons.
 */
const LessonsPreviewWrapper = ({
  selectedLesson,
  isPanelClosed = false,
  setPanelClosed,
  lessonHasActivities,
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
          <div className="flex items-center gap-5">
            <div
              data-tip={
                isPanelClosed
                  ? "Agrandir le panneau latéral"
                  : "Réduire le panneau latéral"
              }
              className="tooltip tooltip-right"
            >
              <button
                onClick={handleTogglePanel}
                className="btn w-fit hover:bg-primary hover:text-base-100"
              >
                {isPanelClosed ? (
                  <PanelLeftOpen className="w-6 h-6" />
                ) : (
                  <PanelLeftClose className="w-6 h-6" />
                )}
              </button>
            </div>
            <span className="w-full bg-secondary/20 rounded-lg h-full px-2">
              {topProgressBar}
            </span>

            <Can action="write" object="lesson">
              {selectedLesson ? (
                <>
                  <Link
                    to={`/admin/lesson/edit-lesson/${selectedLesson.id}`}
                    className="btn w-fit hover:bg-primary hover:text-base-100 tooltip tooltip-left"
                    data-tip="Modifier les informations"
                  >
                    <Edit className="w-6 h-6" />
                  </Link>
                  {lessonHasActivities ? (
                    <Link
                      to={`/admin/lesson/edit/${selectedLesson.id}`}
                      className="btn w-fit hover:bg-primary hover:text-base-100 tooltip tooltip-left"
                      data-tip="Modifier les activités"
                    >
                      <ClipboardList className="w-6 h-6" />
                    </Link>
                  ) : null}
                </>
              ) : null}
            </Can>
          </div>

          {selectedLesson ? previewLesson : moduleData}
        </div>
      </div>
    </div>
  );
};

export default LessonsPreviewWrapper;
