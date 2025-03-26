import { Dispatch, PropsWithChildren, SetStateAction } from "react";
import Lesson from "../../utils/interfaces/lesson";
import { Edit, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Can from "../UI/can/can.component";

type LessonsPreviewWrapperProps = {
  parcoursId: number;
  selectedLesson?: Lesson;
  isPanelClosed?: boolean;
  setPanelClosed: Dispatch<SetStateAction<boolean>>;
};

/**
 * Ce composant sert de conteneur (wrapper) structurel pour le composant LessonsPreview.
 * Il encapsule la logique de présentation et la mise en page des aperçus de leçons.
 */
const LessonsPreviewWrapper = ({
  parcoursId,
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

      <div className="mt-5 max-lg:flex max-lg:flex-col-reverse lg:grid lg:grid-cols-4 gap-5 w-full">
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
          className={`flex flex-col gap-5 ${isPanelClosed ? "lg:col-span-4" : "lg:col-span-3"}`}
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
            <Can action="update" object="module">
              <Link
                to={`/admin/parcours/edit/${parcoursId}?step=4`}
                className="btn w-fit hover:bg-primary hover:text-base-100"
              >
                <Edit className="w-5 h-5" />
                Modifier le module
              </Link>
            </Can>
          </div>

          {selectedLesson ? previewLesson : moduleData}
        </div>
      </div>
    </div>
  );
};

export default LessonsPreviewWrapper;
