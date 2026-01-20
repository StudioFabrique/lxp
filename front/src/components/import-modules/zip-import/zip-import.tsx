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
  importedModules?: ModuleImportType[]; // On passe les modules importés via props ou contexte
};

const ZipImport = ({ onImportZip, importedModules }: Props) => {
  // On stocke l'activité sélectionnée pour la prévisualisation
  const [selectedActivity, setSelectedActivity] =
    useState<ActivityImportType | null>(null);

  // Reset la selection si on change de fichier
  useEffect(() => {
    setSelectedActivity(null);
  }, [importedModules]);

  return (
    <div className="flex flex-col gap-6">
      <Header
        title="Première étape"
        description="Téléverser un dossier compressé de format .zip"
      >
        <div className="flex items-center gap-4">
          <MemoizedFileUpload
            variant="minimized"
            maxSize={10000000} // Augmenté pour le zip
            onSetFile={onImportZip}
            fileType="zip"
          />
          {importedModules && importedModules.length > 0 && (
            <span className="text-green-600 font-medium">
              {importedModules.length} module(s) chargé(s)
            </span>
          )}
        </div>
        <button className="btn ml-5" disabled={!importedModules}>
          Confirmer l'importation
        </button>
      </Header>

      {/* Zone de contenu principale : Grid 2 colonnes */}
      {importedModules && importedModules.length > 0 && (
        <div className="grid grid-cols-12 gap-6 h-[600px] border-t pt-4">
          {/* Colonne de gauche : Liste de navigation (30-40% largeur) */}
          <div className="col-span-4 overflow-y-auto border-r pr-4">
            <h3 className="text-lg font-bold mb-4">Structure importée</h3>
            <ModulesImportList
              modules={importedModules}
              onSelectActivity={setSelectedActivity}
              selectedActivityId={selectedActivity?.id}
            />
          </div>

          {/* Colonne de droite : Preview avec Tiptap */}
          <div className="col-span-8 overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">Prévisualisation</h3>
            <PreviewActivitiesFromImport activity={selectedActivity} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ZipImport;
