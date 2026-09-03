import type React from "react";
import type Lesson from "../../../../src/utils/interfaces/lesson";
import {
  ListChevronsUpDown,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { motion } from "motion/react";

type ModuleContentExplorerWrapperProps = {
  selectedLesson?: Lesson;
  isPanelClosed?: boolean;
  onTogglePanel: () => void;
  onCloseAll: () => void;
  publishAllAction?: React.ReactNode;
  scrollTopRef: React.RefObject<HTMLDivElement | null>;
  header: React.ReactNode;
  progressionSide: React.ReactNode;
  topProgressBar: React.ReactNode;
  previewLesson: React.ReactNode;
  moduleData: React.ReactNode;
};

/**
 * Ce composant sert de conteneur (wrapper) structurel pour le composant ModuleContentExplorer.
 * Il encapsule la logique de présentation et la mise en page des aperçus de leçons en utilisant des props.
 */
const ModuleContentExplorerWrapper = ({
  selectedLesson,
  isPanelClosed = false,
  onTogglePanel,
  onCloseAll,
  publishAllAction,
  scrollTopRef,
  header,
  progressionSide,
  topProgressBar,
  previewLesson,
  moduleData,
}: ModuleContentExplorerWrapperProps) => {
  return (
    <div className="w-full overflow-x-clip">
      {header}

      <div className="flex items-center gap-5 mt-5">
        <div
          data-tip={isPanelClosed ? "Ouvrir le panneau" : "Réduire le panneau"}
          className="tooltip tooltip-right"
        >
          <button
            type="button"
            onClick={onTogglePanel}
            className="btn btn-primary w-fit border-secondary/20"
          >
            {isPanelClosed ? (
              <PanelLeftOpen className="w-6 h-6" />
            ) : (
              <PanelLeftClose className="w-6 h-6" />
            )}
          </button>
        </div>
        <span
          ref={scrollTopRef}
          className="w-full bg-secondary/20 rounded-lg h-10 px-2 border border-secondary/20 flex items-center"
        >
          {topProgressBar}
        </span>
        {publishAllAction}
        {selectedLesson ? (
          <button
            type="button"
            className="btn tooltip tooltip-left border-secondary/20"
            aria-label="Tout réduire"
            data-tip="Tout réduire"
            onClick={onCloseAll}
          >
            <ListChevronsUpDown className="w-5 h-5" />
          </button>
        ) : null}
      </div>

      <div className="mt-5 grid grid-cols-[minmax(7.5rem,1fr)_minmax(0,2fr)] gap-2 sm:grid-cols-[minmax(9rem,1fr)_minmax(0,2fr)] sm:gap-3 lg:grid-cols-3 lg:gap-5 w-full">
        {!isPanelClosed && (
          <motion.div
            className="min-w-0"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {progressionSide}
          </motion.div>
        )}
        <div
          className={`flex flex-col gap-2 min-h-[80vh] ${
            isPanelClosed ? "col-span-2 lg:col-span-3" : "col-span-1 lg:col-span-2"
          }`}
        >
          {selectedLesson ? previewLesson : moduleData}
        </div>
      </div>
    </div>
  );
};

export default ModuleContentExplorerWrapper;
