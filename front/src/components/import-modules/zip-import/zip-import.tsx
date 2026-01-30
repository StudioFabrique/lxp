import { useState, useEffect } from "react";
import Header from "../../UI/header";
import MemoizedFileUpload from "../../UI/image-file-upload/image-file-upload";
import PreviewActivitiesFromImport from "./preview-activities-from-import";
import ModuleArborescence from "./module-arborescence";
import {
  ActivityImport,
  ModuleImport,
} from "../../../views/module/hooks/use-import-modules";
import { Eye, Component } from "lucide-react";
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
};

const ZipImport = ({
  importedModules,
  error,
  tooltipErrorTip,
  onImportZip,
  onConfirmZipImport,
  onRemoveModule,
}: Props) => {
  // Module actuellement affiché
  const [selectedModule, setSelectedModule] = useState<ModuleImport | null>(
    null,
  );
  // Activité sélectionnée pour la prévisualisation
  const [selectedActivity, setSelectedActivity] =
    useState<ActivityImport | null>(null);

  const headerDescription = error
    ? error
    : importedModules
      ? `${importedModules.length > 1 ? importedModules.length + " m" : "M"}odule${importedModules.length > 1 ? "s" : ""} prêt${importedModules.length > 1 ? "s" : ""} à être importé${importedModules.length > 1 ? "s" : ""}`
      : "Téléverser un dossier compressé de format .zip";

  // Gestion du changement de module
  const handlePreviewModule = (module: ModuleImport) => {
    setSelectedModule(module);
    setSelectedActivity(null);
  };

  // Dès qu'on importe, on sélectionne le premier module par défaut
  useEffect(() => {
    if (importedModules && importedModules.length > 0) {
      // Si un module est déjà sélectionné et existe encore, on le garde, sinon on prend le premier
      if (
        !selectedModule ||
        !importedModules.find((m) => m.title === selectedModule.title)
      ) {
        setSelectedModule(importedModules[0]);
      }
    } else {
      setSelectedModule(null);
    }
    setSelectedActivity(null);
  }, [importedModules, selectedModule]);

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
          className="btn btn-sm btn-success hover:text-base-100 ml-5 mr-2"
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
          {/* Grille de Cards DaisyUI */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {importedModules.map((module, idx) => {
              const isSelected = selectedModule?.title === module.title;

              const subtitle = `${module.courses.length} cours • ${module.courses.reduce(
                (acc, c) => acc + c.lessons.length,
                0,
              )} leçons`;

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
                  onDelete={() => {
                    onRemoveModule?.(module.title);
                  }}
                  deleteTooltip="Retirer de l'import"
                />
              );
            })}
          </div>

          {/* Zone de prévisualisation : Grid 2 colonnes */}
          {selectedModule && (
            <div className="grid grid-cols-12 gap-6 h-[600px] bg-base-300 rounded-xl border border-base-200 p-4 mt-2">
              {/* Colonne de gauche : Arborescence */}
              <div className="select-none col-span-4 overflow-y-auto border-r border-secondary/20 pr-4 custom-scrollbar">
                <h3 className="text-xs uppercase tracking-wide text-primary font-bold mb-3">
                  Module : {selectedModule.title}
                </h3>
                <ModuleArborescence
                  activeModule={selectedModule}
                  onSelectActivity={setSelectedActivity}
                  selectedActivityId={selectedActivity?.id}
                />
              </div>

              {/* Colonne de droite : Preview */}
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
