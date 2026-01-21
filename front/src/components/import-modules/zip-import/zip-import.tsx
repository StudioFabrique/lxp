import { useState, useEffect } from "react";
import Header from "../../UI/header";
import MemoizedFileUpload from "../../UI/image-file-upload/image-file-upload";
import PreviewActivitiesFromImport from "./preview-activities-from-import";
import ModulesImportList from "./modules-import-list";
import {
  ActivityImportType,
  ModuleImportType,
} from "../../../views/module/hooks/use-import-modules";
import { Eye, Trash2, CheckCircle2, Component } from "lucide-react";

type Props = {
  importedModules?: ModuleImportType[];
  error?: string;
  onImportZip: (file: File) => void;
  onConfirmZipImport: () => void;
  onRemoveModule?: (moduleTitle: string) => void;
};

const ZipImport = ({
  importedModules,
  error,
  onImportZip,
  onConfirmZipImport,
  onRemoveModule,
}: Props) => {
  // Module actuellement affiché
  const [selectedModule, setSelectedModule] = useState<ModuleImportType | null>(
    null,
  );
  // Activité sélectionnée pour la prévisualisation
  const [selectedActivity, setSelectedActivity] =
    useState<ActivityImportType | null>(null);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [importedModules]);

  // Gestion du changement de module
  const handlePreviewModule = (module: ModuleImportType) => {
    setSelectedModule(module);
    setSelectedActivity(null);
  };

  // Gestion de la suppression (à connecter avec le parent)
  const handleDeleteModule = (moduleTitle: string) => {
    if (onRemoveModule) {
      onRemoveModule(moduleTitle);
    } else {
      console.log("Logique de suppression à implémenter pour :", moduleTitle);
      alert("Fonction de suppression non connectée");
    }
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
          className="btn btn-success hover:text-base-100 ml-5"
          disabled={!importedModules}
          onClick={onConfirmZipImport}
        >
          Confirmer l'importation
        </button>
      </Header>

      {/* --- SECTION : Liste des modules (Cards DaisyUI) --- */}
      {importedModules && importedModules.length > 0 && (
        <div className="flex flex-col gap-6 border-t border-base-200 pt-6">
          <div className="flex items-center justify-between px-1">
            <span className="text-base-content font-medium flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success" />
              {`${importedModules.length} module${importedModules.length > 1 ? "s" : ""} prêt${importedModules.length > 1 ? "s" : ""} à être importé${importedModules.length > 1 ? "s" : ""}`}
            </span>
          </div>

          {/* Grille de Cards DaisyUI */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {importedModules.map((module, idx) => {
              const isSelected = selectedModule?.title === module.title;

              return (
                <div
                  key={idx}
                  className={`card bg-base-100 shadow-sm border transition-all duration-200 hover:shadow-md
                        ${
                          isSelected
                            ? "border-primary ring-1 ring-primary"
                            : "border-base-200"
                        }
                    `}
                >
                  <div className="card-body p-5">
                    <h3
                      className="card-title text-base font-bold text-base-content truncate"
                      title={module.title}
                    >
                      <Component /> {module.title}
                    </h3>

                    <div className="text-xs text-base-content/70 mt-1">
                      {module.courses.length} cours •{" "}
                      {module.courses.reduce(
                        (acc, c) => acc + c.lessons.length,
                        0,
                      )}
                      leçons
                    </div>

                    <div className="card-actions justify-end mt-4 pt-4 border-t border-base-200">
                      {/* Bouton Supprimer */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteModule(module.title);
                        }}
                        className="btn btn-sm btn-ghost text-error hover:bg-error/10 tooltip tooltip-bottom"
                        data-tip="Retirer de l'import"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      {/* Bouton Prévisualiser */}
                      <button
                        onClick={() => handlePreviewModule(module)}
                        className={`btn btn-sm gap-2 ${isSelected ? "btn-primary text-base-100" : "btn-outline btn-primary"}`}
                      >
                        <Eye className="w-4 h-4" />
                        {isSelected ? "Aperçu en cours" : "Prévisualiser"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Zone de prévisualisation : Grid 2 colonnes */}
          {selectedModule && (
            <div className="grid grid-cols-12 gap-6 h-[600px] bg-base-200/50 rounded-xl border border-base-200 p-4 mt-2">
              {/* Colonne de gauche : Arborescence */}
              <div className="col-span-4 overflow-y-auto border-r border-base-300 pr-4 custom-scrollbar">
                <h3 className="text-xs uppercase tracking-wide text-base-content/50 font-bold mb-3">
                  Contenu : {selectedModule.title}
                </h3>
                <ModulesImportList
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
      />
    </div>
  );
};

export default ZipImport;
