import type { PropsWithChildren } from "react";
import type Lesson from "../../utils/interfaces/lesson";
import {
  Edit,
  ListChevronsUpDown,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Can from "../UI/can/can.component";

type LessonsPreviewWrapperProps = {
  parcoursId: number;
  selectedLesson?: Lesson;
  isPanelClosed?: boolean;
  onTogglePanel: () => void;
  setSelectedLesson: (lesson: Lesson | undefined) => void;
};

/**
 * Ce composant sert de conteneur (wrapper) structurel pour le composant LessonsPreview.
 * Il encapsule la logique de présentation et la mise en page des aperçus de leçons.
 */
const LessonsPreviewWrapper = ({
  parcoursId,
  selectedLesson,
  isPanelClosed = false,
  onTogglePanel,
  setSelectedLesson,
  children,
}: PropsWithChildren<LessonsPreviewWrapperProps>) => {
  const [header, progessionSide, topProgressBar, previewLesson, moduleData] =
    children as React.ReactNode[];

  return (
    <div className="w-full overflow-hidden">
      {header}

      <div className="flex items-center gap-5 mt-5">
        <div
          data-tip={isPanelClosed ? "Ouvrir le panneau" : "Fermer le panneau"}
          className="tooltip tooltip-right"
        >
          <button
            type="button"
            onClick={onTogglePanel}
            className="btn w-fit hover:bg-primary hover:text-base-100 border-secondary/20"
          >
            {isPanelClosed ? (
              <PanelLeftOpen className="w-6 h-6" />
            ) : (
              <PanelLeftClose className="w-6 h-6" />
            )}
          </button>
        </div>
        <span className="w-full bg-secondary/20 rounded-lg h-10 px-2 border-1 border-secondary/20 flex items-center">
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
        {selectedLesson ? (
          <button
            type="button"
            className="btn hover:bg-primary hover:text-base-100 tooltip tooltip-left border-secondary/20"
            aria-label="Fermer"
            data-tip="Tout réduire"
            onClick={() => setSelectedLesson(undefined)}
          >
            <ListChevronsUpDown className="w-5 h-5" />
          </button>
        ) : null}
      </div>

      <div className="mt-5 max-lg:flex max-lg:flex-col-reverse lg:grid lg:grid-cols-3 gap-5 w-full">
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
          className={`flex flex-col gap-5 ${
            isPanelClosed ? "lg:col-span-3" : "lg:col-span-2"
          }`}
        >
          {selectedLesson ? previewLesson : moduleData}
        </div>
      </div>
    </div>
  );
};

export default LessonsPreviewWrapper;
