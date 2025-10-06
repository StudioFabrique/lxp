import { type ChangeEvent, useState } from "react";
import toast from "react-hot-toast";
import useAutosave from "./hooks/useAutosave";
import AutosaveIndicator from "./autosave-indicator";
import TiptapEditor from "../../UI/tiptap-editor/tiptapEditor";

type Props = {
  mode: "read" | "create" | "edit";
  id?: number;
  title?: string;
  content?: string;
  autosaveEnabled?: boolean;
  onSave: (
    id: number | undefined,
    title: string,
    content: string
  ) => Promise<boolean>;
  onClose?: () => void;
};

/**
 * Composant contenant l'éditeur de texte Tiptap ainsi que la logique de création/modification/lecture d'une activité
 * @param id L'id (number, optionnel)
 * @param title Le titre (si déjà existant) qui est affiché dans la zone de texte au dessus de l'éditeur de texte (string, optionnel)
 * @param content Le contenu (si déjà existant) à passer à l’éditeur de texte (string, optionnel)
 * @param onSave Fonction qui se déclenche lorsque l'utilisateur sauvegarde l'activité. Une promesse avec un retour de type boolean est attendue,
 *               si la requête se passe bien alors la prommesse doit retourner "true", sinon "false".
 * @param onClose Fonction qui se déclenche lorsque l'utilisateur ferme ce composant
 */
const TiptapActivity = ({
  mode,
  id,
  title,
  content,
  onSave,
  onClose,
}: Props) => {
  const [editorTitle, setEditorTitle] = useState<string>(title || "");
  const [editorContent, setEditorContent] = useState<string>(content || "");

  // Hook d'autosave
  const { lastAutosaveTime, showAutosaveIndicator, clearStorage } = useAutosave(
    {
      title: editorTitle,
      content: editorContent,
      activityId: id,
      setEditorContent,
      setEditorTitle,
    }
  );

  const handleChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setEditorTitle(e.currentTarget.value);
  };

  // Fonction pour mettre à jour le contenu de l'éditeur
  const handleUpdateEditorContent = (content: string) => {
    setEditorContent(content);
  };

  // Fonction pour fermer l'éditeur
  const handleCloseEditor = () => {
    onClose?.();
  };

  const handleSave = async () => {
    // Si le titre est manquant, avertir l'utilisateur via un toast
    if (!(editorTitle.length > 0)) {
      toast.error("Le titre est obligatoire");
      return;
    }

    // Sauvegarder l'activité, et si la sauvegarde réussi, effacer la sauvegarde locale pour l'autosave et fermer l'éditeur
    if (await onSave(id, editorTitle, editorContent)) {
      clearStorage();
      onClose?.();
    }
  };

  return (
    <>
      {/* Indicateur d'autosave */}
      {mode === "create" && (
        <AutosaveIndicator
          isVisible={showAutosaveIndicator}
          lastSaveTime={lastAutosaveTime}
        />
      )}

      <div className="py-4 flex gap-4 items-center">
        {/* Input titre */}
        <label className="label min-w-fit" htmlFor="activity-title">
          Titre de l'activité :
        </label>
        <input
          id="activity-title"
          value={title}
          onChange={handleChangeTitle}
          type="text"
          className="input input-sm input-bordered flex-1"
          placeholder="Saisissez le titre de l'activité"
          autoFocus
        />
        <button
          className="btn btn-sm btn-primary text-base-100"
          onClick={handleCloseEditor}
        >
          Annuler
        </button>
      </div>

      <div className="w-[100%] bg-base-200 rounded-lg p-4">
        <TiptapEditor
          mode={mode}
          initialValue={editorContent}
          onSave={handleSave}
          onContentChange={handleUpdateEditorContent}
        />
      </div>
    </>
  );
};

export default TiptapActivity;
