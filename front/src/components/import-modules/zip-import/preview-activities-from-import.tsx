import { useEffect, useState } from "react";
import TiptapEditor from "../../UI/tiptap-editor/tiptapEditor";
import { ActivityImport } from "../../../views/module/hooks/use-import-modules";
import { ArrowUpRight, EyeIcon } from "lucide-react";
import activityIconType from "../../../utils/activity-icon-type";
import toUpperFirstLetter from "../../../utils/toUpperFirstLetter";

type Props = {
  activity: ActivityImport | null;
  error?: string;
};

const PreviewActivitiesFromImport = ({ activity, error }: Props) => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  // Gestion de l'URL pour les fichiers Blob (PDF)
  useEffect(() => {
    let objectUrl: string | null = null;

    if (activity?.type === "file" && activity.value instanceof Blob) {
      objectUrl = URL.createObjectURL(activity.value);
      setFileUrl(objectUrl);
    } else {
      setFileUrl(null);
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [activity]);

  // Fonction de rendu du contenu pour séparer proprement la logique
  const renderContent = () => {
    if (!activity) return null;

    // CAS 1 : TEXTE
    if (activity.type === "text" && typeof activity.value === "string") {
      return (
        <div key={`text-wrapper-${activity.id}`}>
          <TiptapEditor
            key={activity.id}
            mode="read"
            initialValue={activity.value}
          />
        </div>
      );
    }

    if (activity.type === "text" && activity.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-64 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg gap-4">
          <p className="font-semibold text-secondary">Activité de type texte</p>
          <div className="flex flex-col items-center gap-4 text-xs text-red-400">
            <span>Le fichier est manquant</span>
            <span>({activity.url})</span>
          </div>
        </div>
      );
    }

    // CAS 2 : FICHIER (PDF)
    if (activity.type === "file") {
      return (
        <div
          key={`file-wrapper-${activity.id}`}
          className="flex flex-col items-center justify-center h-64 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg gap-4"
        >
          <div className="text-center flex flex-col gap-4 items-center">
            <p className="font-semibold text-secondary">
              Activité de type fichier
            </p>

            {fileUrl ? (
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-soft btn-sm"
              >
                Ouvrir le document <ArrowUpRight className="w-4" />
              </a>
            ) : (
              <div className="flex flex-col items-center gap-4 text-xs text-red-400">
                <span>Le fichier est manquant</span>
                <span>({activity.url})</span>
              </div>
            )}
          </div>
        </div>
      );
    }

    // CAS 3 : NON SUPPORTÉ
    return (
      <div className="p-10 text-center text-gray-500 bg-gray-50 rounded border border-dashed">
        Type de contenu non supporté par la prévisualisation.
      </div>
    );
  };

  if (!activity) {
    return (
      <div className="select-none h-full flex flex-col items-center justify-center text-gray-400 p-10">
        <EyeIcon className="w-12 h-12" />
        <p>
          Sélectionner une activité dans la menu de navigation pour
          prévisualiser son contenu.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full">
      {error ? (
        <div className="flex flex-col items-center p-10">
          <span className="text-error">{error}</span>
        </div>
      ) : (
        <div className="flex flex-col h-full p-5">
          {/* Header */}
          <div className="font-semibold text-primary flex justify-between items-center">
            <div className="flex gap-1 items-center w-[92%]">
              <span className="w-5">{activityIconType(activity.type)}</span>
              <span className="text-2xl px-2 w-fit">
                {toUpperFirstLetter(activity.title)}
              </span>
            </div>
            <span className="flex-1" />
          </div>

          {/* Rendu du contenu de preview des activités */}
          <div className="p-6 h-full overflow-y-auto">{renderContent()}</div>
        </div>
      )}
    </div>
  );
};

export default PreviewActivitiesFromImport;
