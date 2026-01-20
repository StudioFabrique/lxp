import SubWrapper from "../../UI/sub-wrapper/sub-wrapper.component";
import TiptapEditor from "../../UI/tiptap-editor/tiptapEditor";
import { ActivityImportType } from "../../../views/module/hooks/use-import-modules";

type Props = {
  activity: ActivityImportType | null;
  error?: string;
};

const PreviewActivitiesFromImport = ({ activity, error }: Props) => {
  if (!activity) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400 bg-gray-50 border rounded-lg p-10">
        Sélectionnez une activité à gauche pour voir son contenu.
      </div>
    );
  }

  return (
    <div className="px-1">
      <SubWrapper hasError={Boolean(error)}>
        {error ? (
          <div className="flex flex-col items-center p-10">
            <span>L'exportation a échoué.</span>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {/* Header de la preview */}
            <div className="bg-white p-4 border-b">
              <h2 className="text-xl font-bold">{activity.title}</h2>
              <div className="flex gap-2 mt-2 text-xs uppercase tracking-wide text-gray-500">
                <span className="bg-gray-100 px-2 py-1 rounded">
                  Type: {activity.type}
                </span>
                <span className="bg-gray-100 px-2 py-1 rounded">
                  Ordre: {activity.order}
                </span>
              </div>
            </div>

            {/* Contenu */}
            <div className="bg-white min-h-[400px]">
              {activity.type === "text" && activity.value ? (
                // L'attribut key est CRUCIAL ici pour forcer le re-render de Tiptap
                // quand on change d'activité
                <TiptapEditor
                  key={activity.id}
                  mode="read"
                  initialValue={activity.value}
                />
              ) : activity.type === "file" ? (
                <div className="flex flex-col items-center justify-center h-64 bg-gray-50 border border-dashed rounded">
                  <p className="font-semibold text-gray-600">
                    Aperçu non disponible pour les fichiers
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Fichier: {activity.url}
                  </p>
                </div>
              ) : (
                <div className="p-10 text-center text-gray-500">
                  Type de contenu non supporté par la prévisualisation.
                </div>
              )}
            </div>
          </div>
        )}
      </SubWrapper>
    </div>
  );
};

export default PreviewActivitiesFromImport;
