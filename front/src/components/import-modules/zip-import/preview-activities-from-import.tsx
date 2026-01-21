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
      <SubWrapper hasError={Boolean(error)}>
        {error ? (
          <div className="flex flex-col items-center p-10">
            <span>L'exportation a échoué.</span>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            {/* Header de la preview */}
            <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center sticky top-0 z-10">
              <h2
                className="text-lg font-bold text-gray-800 truncate"
                title={activity.title}
              >
                {activity.title}
              </h2>
              <div className="flex gap-2 text-[10px] uppercase font-bold tracking-wider text-gray-500">
                <span className="bg-white border px-2 py-1 rounded shadow-sm">
                  {activity.type}
                </span>
                <span className="bg-white border px-2 py-1 rounded shadow-sm">
                  Pos: {activity.order}
                </span>
              </div>
            </div>

            {/* Contenu */}
            <div className="p-6">
              {activity.type === "text" && activity.value ? (
                <TiptapEditor mode="read" initialValue={activity.value} />
              ) : activity.type === "file" ? (
                <div className="flex flex-col items-center justify-center h-64 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg">
                  <span className="text-4xl mb-2">📄</span>
                  <p className="font-semibold text-gray-600">Aperçu fichier</p>
                  <p className="text-xs text-gray-400 mt-1 max-w-xs truncate">
                    {activity.url}
                  </p>
                </div>
              ) : (
                <div className="p-10 text-center text-gray-500 bg-gray-50 rounded border border-dashed">
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
