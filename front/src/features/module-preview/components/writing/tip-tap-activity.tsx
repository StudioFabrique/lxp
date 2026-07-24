import useAutosave from "./hooks/use-autosave";
import { useState } from "react";
import AutosaveIndicator from "./autosave-indicator";
import TiptapEditor from "../../../../components/tiptap-editor/tiptapEditor";

type Props = {
  mode: "read" | "write" | "edit" | "activity_type_selection";
  id?: number;
  title?: string;
  content?: string;
  onEditTitle: (title: string) => void;
  onEditContent: (content: string) => void;
  onSave: (id?: number, title?: string, content?: string) => Promise<boolean>;
  onFinishSaving?: () => void;
  onClose?: () => void;
};

/**
 * Composant contenant l'éditeur de texte Tiptap ainsi que la logique de création/modification/lecture d'une activité
 * @param mode Le mode actuel de l'activité selectionnée ("read", "create" ou "edit")
 * @param id L'id (number, optionnel)
 * @param title Le titre de l'activité géré dans le header parent (string, optionnel)
 * @param content Le contenu (si déjà existant) à passer à l'éditeur de texte (string, optionnel)
 * @param onSave Fonction qui se déclenche lorsque l'utilisateur sauvegarde l'activité. Une promesse avec un retour de type boolean est attendue,
 *               si la requête se passe bien alors la prommesse doit retourner "true", sinon "false".
 * @param onClose Fonction qui se déclenche lorsque l'utilisateur ferme ce composant
 */
const TiptapActivity = ({
  mode,
  id,
  title,
  content,
  onEditTitle,
  onEditContent,
  onSave,
  onFinishSaving,
  onClose,
}: Props) => {
  const [pending, setPending] = useState<boolean>(false);

  // Hook d'autosave
  const { lastAutosaveTime, showAutosaveIndicator, clearStorage } = useAutosave(
    {
      isWriting: mode === "write",
      title,
      content,
      activityId: id,
      onEditTitle,
      onEditContent,
    },
  );

  const handleSave = async (finalContent: string) => {
    setPending(true);

    onEditContent(finalContent);

    if (await onSave(id, title, finalContent)) {
      clearStorage();
      setPending(false);
      onFinishSaving?.();
      onClose?.();
    } else {
      setPending(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Indicateur d'autosave */}
      <AutosaveIndicator
        isVisible={showAutosaveIndicator}
        lastSaveTime={lastAutosaveTime}
      />

      <div className={`w-full rounded-lg p-4 bg-base-200`}>
        <TiptapEditor
          mode={mode}
          initialValue={content}
          pending={pending}
          onSave={handleSave}
          onContentChange={onEditContent}
        />
      </div>
      {mode !== "read" && onClose && (
        <button
          className="btn btn-sm btn-error text-base-100 self-end"
          onClick={onClose}
        >
          Annuler
        </button>
      )}
    </div>
  );
};

export default TiptapActivity;
