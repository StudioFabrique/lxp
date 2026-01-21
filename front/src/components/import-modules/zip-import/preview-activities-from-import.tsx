import { useEffect, useState } from "react";
import TiptapEditor from "../../UI/tiptap-editor/tiptapEditor";
import { ActivityImportType } from "../../../views/module/hooks/use-import-modules";

type Props = {
  activity: ActivityImportType | null;
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
  }, [activity]); // Dépendance à 'activity' entière pour être sûr

  // Fonction de rendu du contenu pour séparer proprement la logique
  const renderContent = () => {
    if (!activity) return null;

    // CAS 1 : TEXTE
    if (activity.type === "text" && typeof activity.value === "string") {
      return (
        <div key={`text-wrapper-${activity.id}`} className="prose max-w-none">
          <TiptapEditor
            // On garde aussi la key ici par sécurité
            key={activity.id}
            mode="read"
            initialValue={activity.value}
          />
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
          <span className="text-5xl">📄</span>
          <div className="text-center">
            <p className="font-semibold text-gray-700">Document PDF</p>
            <p className="text-xs text-gray-400 mt-1 max-w-xs truncate mb-4">
              {activity.url}
            </p>

            {fileUrl ? (
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm"
              >
                Ouvrir le document ↗
              </a>
            ) : (
              <span className="text-xs text-red-400">
                Impossible de générer l'aperçu (format invalide)
              </span>
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
      <div className="h-full flex flex-col items-center justify-center text-gray-400 p-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-12 h-12 mb-3 opacity-50"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <p>
          Sélectionnez une activité dans le menu de gauche pour prévisualiser
          son contenu.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full">
      {error ? (
        <div className="flex flex-col items-center p-10">
          <span>L'exportation a échoué.</span>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center sticky top-0 z-10">
            <h2
              className="text-lg font-bold text-gray-800 truncate"
              title={activity.title}
            >
              {activity.title}
            </h2>
            <span className="text-xs uppercase font-bold tracking-wider text-gray-500 bg-white border px-2 py-1 rounded">
              {activity.type}
            </span>
          </div>

          {/* Rendu du contenu de preview des activités */}
          <div className="p-6 h-full overflow-y-auto">{renderContent()}</div>
        </div>
      )}
    </div>
  );
};

export default PreviewActivitiesFromImport;
