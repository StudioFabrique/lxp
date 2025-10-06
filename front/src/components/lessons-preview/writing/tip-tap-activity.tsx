import { type ChangeEvent, useRef, useState, useEffect } from "react";
import type { Editor } from "@tiptap/react";
import toast from "react-hot-toast";
import useHttp from "../../../hooks/use-http";
import { useAutosave } from "../../../hooks/use-autosave";
import AutosaveIndicator from "./autosave-indicator";
import { Activity } from "../../../utils/interfaces/activity";
import TiptapEditor from "./tiptap-editor/tiptap-editor";

type ActivityWithContent = Activity & { content: string };

type TipTapActivityProps = {
  parent?: "resource" | "lesson";
  parentId: number;
  activity?: ActivityWithContent;
  isNewActivity?: boolean;
  onCloseTipTapEditor?: () => void;
  onRefreshAllData?: () => void;
  onActivityEditChange?: (isEditing: boolean) => void;
  shouldStartEdit?: boolean;
  forceStopEdit?: boolean;
};

const TipTapActivity = ({
  parent = "lesson",
  parentId,
  activity,
  isNewActivity = false,
  onCloseTipTapEditor,
  onRefreshAllData,
  onActivityEditChange,
  shouldStartEdit = false,
  forceStopEdit = false,
}: TipTapActivityProps) => {
  const { sendRequest } = useHttp(true);
  const [showAutosaveIndicator, setShowAutosaveIndicator] =
    useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const [isEditingActivity, setEditingActivity] = useState<boolean>(
    isNewActivity || shouldStartEdit
  );

  const [title, setTitle] = useState<string>(activity?.title || "");
  const [editorContent, setEditorContent] = useState<string>(
    activity?.content || ""
  );

  const editorRef = useRef<Editor | null>(null);

  // Hook d'autosave
  const { lastAutosaveTime, restoreAutosavedContent, clearStorage } =
    useAutosave({
      title,
      content: editorContent,
      parentId,
      activityId: activity?.id,
      isNewActivity,
    });

  // Effet pour gérer l'édition depuis l'extérieur
  useEffect(() => {
    if (shouldStartEdit && !isEditingActivity) {
      setEditingActivity(true);
    } else if (forceStopEdit && isEditingActivity) {
      setEditingActivity(false);
    }
  }, [shouldStartEdit, forceStopEdit, isEditingActivity]);

  const onChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value);
  };

  // Fonction pour mettre à jour le contenu de l'éditeur
  const updateEditorContent = (content: string) => {
    setEditorContent(content);
  };

  // Effet pour restaurer le contenu autosauvegardé au chargement
  useEffect(() => {
    if (isNewActivity && !activity) {
      const autosavedData = restoreAutosavedContent();
      const autoSavedContentLength =
        autosavedData?.content.replace(/<[^>]+>/g, "").length || 0;

      if (autosavedData.wasRestored) {
        setTitle(autosavedData.title);
        setEditorContent(autosavedData.content);
        autoSavedContentLength > 0 && setShowAutosaveIndicator(true);
      }
    }
  }, [isNewActivity, activity, restoreAutosavedContent]);

  // Effet pour mettre à jour le titre et le contenu quand l'activité change
  useEffect(() => {
    if (activity && !isNewActivity) {
      setTitle(activity.title || "");
      setEditorContent(activity.content || "");
    }
  }, [activity, isNewActivity]);

  // Effet pour cacher l'indicateur d'autosave après un délai
  useEffect(() => {
    if (showAutosaveIndicator) {
      const timer = setTimeout(() => {
        setShowAutosaveIndicator(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showAutosaveIndicator]);

  // Fonction pour fermer l'éditeur avec nettoyage optionnel de l'autosave
  const handleCloseEditor = () => {
    if (isNewActivity && (title.trim() || editorContent.trim())) {
      // Pour une nouvelle activité, garder l'autosave si il y a du contenu
      // L'utilisateur peut vouloir revenir à son travail plus tard
    } else {
      // Pour les activités existantes, nettoyer l'autosave à la fermeture
      clearStorage();
    }
    onCloseTipTapEditor?.();
    setEditingActivity(false);
  };

  useEffect(() => {
    onActivityEditChange?.(isEditingActivity);
  }, [isEditingActivity, onActivityEditChange]);

  // wait 200ms, then scroll to bottom if activity is created
  useEffect(() => {
    if (isNewActivity && isEditingActivity) {
      console.log("scrolling");
      setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
      }, 200);
    }
  }, [isNewActivity, isEditingActivity]);

  const handleSave = () => {
    if (!title.trim() || isSaving) return;

    setIsSaving(true);

    const applyData = (response: { data: Activity }) => {
      toast.success(
        `Activité ${isNewActivity ? "créée" : "modifiée"} avec succès`
      );
      console.log({ response });
      // Nettoie l'autosave après sauvegarde réussie
      clearStorage();
      setIsSaving(false);

      // Pour les nouvelles activités, fermer l'éditeur
      if (isNewActivity) {
        onCloseTipTapEditor?.();
      } else {
        // Pour les activités existantes, juste sortir du mode édition
        setEditingActivity(false);
      }

      onRefreshAllData?.();
    };

    // Supprimer les espaces/paragraphes vides au début et à la fin tout en préservant la mise en forme
    let htmlContent = editorRef.current?.getHTML() || "";

    // Supprimer les paragraphes vides au début
    htmlContent = htmlContent.replace(
      /^(<p><\/p>|<p>\s*<\/p>|<p><br><\/p>)+/,
      ""
    );

    // Supprimer les paragraphes vides à la fin
    htmlContent = htmlContent.replace(
      /(<p><\/p>|<p>\s*<\/p>|<p><br><\/p>)+$/,
      ""
    );

    // Mettre à jour le contenu de l'éditeur avec le HTML nettoyé
    if (htmlContent !== editorRef.current?.getHTML()) {
      editorRef.current?.commands.setContent(htmlContent);
    }

    const value = editorRef.current?.getHTML();
    console.log({ isNewActivity, parent, parentId });

    sendRequest(
      {
        path: `/activity/text/${isNewActivity ? parentId : activity?.id}`,
        method: isNewActivity ? "post" : "put",
        body: {
          description: "description",
          value,
          title: title.trim(),
          parent,
        },
      },
      applyData
    ).catch(() => {
      setIsSaving(false);
    });
  };

  return (
    <>
      {/* Indicateur d'autosave */}
      <AutosaveIndicator
        isVisible={showAutosaveIndicator}
        lastSaveTime={lastAutosaveTime}
      />

      {isEditingActivity && (
        <div className="py-4 flex gap-4 items-center">
          {/* Input titre */}
          <label className="label min-w-fit" htmlFor="activity-title">
            Titre de l'activité :
          </label>
          <input
            id="activity-title"
            value={title}
            onChange={onChangeTitle}
            type="text"
            className="input input-sm input-bordered flex-1"
            placeholder="Saisissez le titre de l'activité"
            autoFocus={isNewActivity}
          />
          <button
            className="btn btn-sm btn-primary text-base-100"
            onClick={handleCloseEditor}
          >
            Annuler
          </button>
        </div>
      )}

      <div className="w-[100%] bg-base-200 rounded-lg p-4">
        <TiptapEditor
          editorRef={editorRef}
          initialValue={editorContent || activity?.content}
          isEditingActivity={isEditingActivity}
          onSave={handleSave}
          onContentChange={updateEditorContent}
        />
      </div>
    </>
  );
};

export default TipTapActivity;
