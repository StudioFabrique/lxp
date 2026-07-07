import { Loader } from "lucide-react";

type Props = {
  onCancel: (value: boolean) => void;
  resetFilesList: () => void;
  handleSubmit: () => void;
  filesNumber: number;
  isLoading: boolean;
  hasError: boolean;
};

function ResourcesAction({
  onCancel,
  resetFilesList,
  handleSubmit,
  filesNumber,
  isLoading,
  cancelUpload,
  hasError,
}: Props & { cancelUpload: () => void }) {
  const handleCancel = () => {
    if (isLoading) {
      const confirmCancel = window.confirm(
        "Des téléversements de fichiers sont en cours, êtes-vous sûr de vouloir annuler ?",
      );
      if (confirmCancel) {
        cancelUpload();
      }
    } else {
      onCancel(false);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <button className="btn btn-primary btn-outline" onClick={handleCancel}>
          Annuler
        </button>
        <span className="flex justify-end items-center gap-x-4">
          <button
            className="btn btn-secondary"
            onClick={resetFilesList}
            disabled={isLoading}
          >
            Réinitialiser
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={filesNumber === 0 || isLoading || hasError}
          >
            {isLoading ? (
              <span className="flex items-center gap-x-2">
                <Loader className="animate-spin" /> <p>En cours...</p>
              </span>
            ) : (
              "Téléverser"
            )}
          </button>
        </span>
      </div>
    </>
  );
}

export default ResourcesAction;
