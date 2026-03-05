import { useState, useEffect } from "react";
import Header from "../../UI/header";
import MemoizedFileUpload from "../../UI/image-file-upload/image-file-upload";
import PreviewActivitiesFromImport from "./preview-activities-from-import";
import ModuleArborescence from "./module-arborescence";
import {
  ActivityImport,
  ModuleImport,
} from "../../../views/module/hooks/use-import-modules";
import { Eye, Component, Check, PenLine } from "lucide-react";
import toUpperFirstLetter from "../../../utils/toUpperFirstLetter";
import QuestionMarkTooltip from "../../UI/question-mark-tooltip/question-mark-tooltip";
import SelectableCard from "../../UI/selectable-card";

type Props = {
  importedModules?: ModuleImport[];
  error?: string;
  tooltipErrorTip?: string;
  onImportZip: (file: File) => void;
  onConfirmZipImport: () => void;
  onRemoveModule?: (moduleTitle: string) => void;
  onUpdateModuleTitle: (moduleId: number, newTitle: string) => void;
  onUpdateCourseTitle: (
    moduleId: number,
    courseId: number,
    newTitle: string,
  ) => void;
  onUpdateLessonTitle: (
    moduleId: number,
    courseId: number,
    lessonId: number,
    newTitle: string,
  ) => void;
  onUpdateActivityTitle: (
    moduleId: number,
    courseId: number,
    lessonId: number,
    activityId: number,
    newTitle: string,
  ) => void;
};

const ZipImport = ({
  importedModules,
  error,
  tooltipErrorTip,
  onImportZip,
  onConfirmZipImport,
  onRemoveModule,
  onUpdateModuleTitle,
  onUpdateCourseTitle,
  onUpdateLessonTitle,
  onUpdateActivityTitle,
}: Props) => {
  const [selectedModule, setSelectedModule] = useState<ModuleImport | null>(
    null,
  );
  const [selectedActivity, setSelectedActivity] =
    useState<ActivityImport | null>(null);

  const [isEditingModuleTitle, setIsEditingModuleTitle] = useState(false);
  const [tempModuleTitle, setTempModuleTitle] = useState("");

  const headerDescription = error
    ? error
    : importedModules
      ? `${importedModules.length > 1 ? importedModules.length + " m" : "M"}odule${importedModules.length > 1 ? "s" : ""} prêt${importedModules.length > 1 ? "s" : ""} à être importé${importedModules.length > 1 ? "s" : ""}`
      : "Téléverser un dossier compressé de format .zip";

  const handlePreviewModule = (module: ModuleImport) => {
    setSelectedModule(module);
    setSelectedActivity(null);
    setTempModuleTitle(module.title);
    setIsEditingModuleTitle(false);
  };

  const handleSaveModuleTitle = () => {
    if (selectedModule && selectedModule.id && tempModuleTitle.trim() !== "") {
      onUpdateModuleTitle(selectedModule.id, tempModuleTitle);
      setIsEditingModuleTitle(false);
    }
  };

  useEffect(() => {
    if (importedModules && importedModules.length > 0) {
      if (selectedModule) {
        // Si on rafraichit la liste (ex: update title), on met à jour la sélection
        const updated = importedModules.find((m) => m.id === selectedModule.id);
        if (updated) {
          setSelectedModule(updated);
          if (!isEditingModuleTitle) setTempModuleTitle(updated.title);
        } else {
          setSelectedModule(importedModules[0]);
          setTempModuleTitle(importedModules[0].title);
        }
      } else {
        setSelectedModule(importedModules[0]);
        setTempModuleTitle(importedModules[0].title);
      }
    } else {
      setSelectedModule(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [importedModules]);

  return (
    <div className="flex flex-col gap-6 ml-5">
      <Header
        title="Première étape"
        isSubHeader
        description={headerDescription}
        alternateBgColor
        hasError={Boolean(error)}
      >
        <MemoizedFileUpload
          buttonLabel="Importer un fichier .zip"
          variant="minimized"
          maxSize={10000000}
          onSetFile={onImportZip}
          fileType="zip"
        />

        <button
          className="btn btn-sm btn-success hover:text-neutral-content ml-5 mr-2"
          disabled={!importedModules || Boolean(error)}
          onClick={onConfirmZipImport}
        >
          Confirmer l'importation
        </button>
        {tooltipErrorTip && (
          <QuestionMarkTooltip
            tooltipValue={tooltipErrorTip}
            tooltipPosition="left"
          />
        )}
      </Header>

      {importedModules && importedModules.length > 0 && (
        <div className="ml-5 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {importedModules.map((module, idx) => {
              const isSelected = selectedModule?.id === module.id;
              const subtitle = `${module.courses.length} cours • ${module.courses.reduce((acc, c) => acc + c.lessons.length, 0)} leçons`;

              return (
                <SelectableCard
                  key={idx}
                  title={toUpperFirstLetter(module.title)}
                  error={
                    module.hasError ? "Des ressources sont manquantes" : ""
                  }
                  subtitle={subtitle}
                  icon={<Component className="w-5 h-5" />}
                  isSelected={isSelected}
                  onAction={() => handlePreviewModule(module)}
                  actionLabel="Aperçu"
                  actionIcon={<Eye className="w-4 h-4" />}
                  onDelete={() => onRemoveModule?.(module.title)}
                  deleteTooltip="Retirer de l'import"
                  onEditTitle={(newTitle) =>
                    module.id && onUpdateModuleTitle(module.id, newTitle)
                  }
                />
              );
            })}
          </div>

          {selectedModule && (
            <div className="grid grid-cols-12 gap-6 h-[600px] bg-base-300 rounded-xl border border-base-200 p-4 mt-2">
              <div className="select-none col-span-4 overflow-y-auto border-r border-secondary/20 pr-4 custom-scrollbar">
                {/* Module Title Edit */}
                <div className="flex items-center gap-2 mb-3 min-h-[32px]">
                  <h3 className="text-xs uppercase tracking-wide text-primary font-bold whitespace-nowrap">
                    Module :
                  </h3>
                  {isEditingModuleTitle ? (
                    <div className="flex items-center gap-1 w-full">
                      <input
                        type="text"
                        value={tempModuleTitle}
                        onChange={(e) => setTempModuleTitle(e.target.value)}
                        className="input input-xs input-bordered w-full"
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleSaveModuleTitle()
                        }
                        autoFocus
                      />
                      <button
                        className="btn btn-xs btn-square btn-success"
                        onClick={handleSaveModuleTitle}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 w-full group">
                      <span className="truncate text-sm font-bold">
                        {selectedModule.title}
                      </span>
                      <button
                        onClick={() => setIsEditingModuleTitle(true)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-base-200 rounded"
                      >
                        <PenLine className="w-3 h-3 text-base-content/60" />
                      </button>
                    </div>
                  )}
                </div>

                <ModuleArborescence
                  activeModule={selectedModule}
                  onSelectActivity={setSelectedActivity}
                  selectedActivityId={selectedActivity?.id}
                  onUpdateCourseTitle={onUpdateCourseTitle}
                  onUpdateLessonTitle={onUpdateLessonTitle}
                  onUpdateActivityTitle={onUpdateActivityTitle}
                />
              </div>

              <div className="col-span-8 overflow-y-auto custom-scrollbar bg-base-100 rounded-lg shadow-sm border border-base-200 h-full">
                <PreviewActivitiesFromImport activity={selectedActivity} />
              </div>
            </div>
          )}
        </div>
      )}

      <Header
        title="Seconde étape"
        description="Selectionner le parcours auquels les modules seront rattachés"
        disabled
        isSubHeader
      />
    </div>
  );
};

export default ZipImport;
