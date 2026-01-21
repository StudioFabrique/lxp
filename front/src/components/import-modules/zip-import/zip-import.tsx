import { useState, useEffect } from "react";
import Header from "../../UI/header";
import MemoizedFileUpload from "../../UI/image-file-upload/image-file-upload";
import PreviewActivitiesFromImport from "./preview-activities-from-import";
import ModulesImportList from "./modules-import-list";
import {
  ActivityImportType,
  ModuleImportType,
} from "../../../views/module/hooks/use-import-modules";

type Props = {
  onImportZip: (file: File) => void;
  importedModules?: ModuleImportType[];
  error: string;
};

const ZipImport = ({ onImportZip, importedModules, error }: Props) => {
  // Module actuellement affiché
  const [selectedModule, setSelectedModule] = useState<ModuleImportType | null>(
    null,
  );
  // Activité sélectionnée pour la prévisualisation
  const [selectedActivity, setSelectedActivity] =
    useState<ActivityImportType | null>(null);

  // Dès qu'on importe, on sélectionne le premier module par défaut et on reset l'activité
  useEffect(() => {
    if (importedModules && importedModules.length > 0) {
      setSelectedModule(importedModules[0]);
    } else {
      setSelectedModule(null);
    }
    setSelectedActivity(null);
  }, [importedModules]);

  // Si on change de module manuellement, on reset la preview
  const handleModuleChange = (module: ModuleImportType) => {
    setSelectedModule(module);
    setSelectedActivity(null);
  };

  return (
    <div className="flex flex-col gap-6 ml-5">
      <Header
        title="Première étape"
        description={
          error ? error : "Téléverser un dossier compressé de format .zip"
        }
        alternateBgColor
        hasError={Boolean(error)}
      >
        <div className="flex items-center gap-4">
          <MemoizedFileUpload
            variant="minimized"
            maxSize={10000000}
            onSetFile={onImportZip}
            fileType="zip"
          />
        </div>
        <button
          className="btn btn-primary btn-soft hover:text-base-100 ml-5"
          disabled={!importedModules}
        >
          Confirmer l'importation
        </button>
      </Header>

      {/* --- NOUVELLE SECTION : Onglets des modules --- */}
      {importedModules && importedModules.length > 0 && (
        <div className="flex flex-col gap-4 border-t pt-4">
          <div className="flex items-center justify-between">
            <span className="text-green-600 font-medium">
              {importedModules.length} module(s) chargé(s)
            </span>
          </div>

          {/* Liste horizontale des modules */}
          <div className="flex flex-wrap gap-2">
            {importedModules.map((module, idx) => (
              <button
                key={idx}
                onClick={() => handleModuleChange(module)}
                className={`px-4 py-2 rounded-lg border text-sm font-semibold transition-all
                  ${
                    selectedModule?.title === module.title
                      ? "bg-blue-600 text-white border-blue-600 shadow-md"
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                  }`}
              >
                {module.title}
              </button>
            ))}
          </div>

          {/* Zone de contenu principale : Grid 2 colonnes */}
          <div className="grid grid-cols-12 gap-6 h-[600px] bg-gray-50/50 rounded-xl border p-4">
            {/* Colonne de gauche : Arborescence du module sélectionné */}
            <div className="col-span-4 overflow-y-auto border-r pr-4 custom-scrollbar">
              <h3 className="text-sm uppercase tracking-wide text-gray-500 font-bold mb-3">
                Contenu du module
              </h3>
              <ModulesImportList
                activeModule={selectedModule}
                onSelectActivity={setSelectedActivity}
                selectedActivityId={selectedActivity?.id}
              />
            </div>

            {/* Colonne de droite : Preview */}
            <div className="col-span-8 overflow-y-auto custom-scrollbar bg-white rounded-lg shadow-sm border h-full">
              <PreviewActivitiesFromImport activity={selectedActivity} />
            </div>
          </div>
        </div>
      )}

      <Header
        title="Seconde étape"
        description="Selectionner le parcours auquels les modules seront rattachés"
        disabled
      />
    </div>
  );
};

export default ZipImport;
