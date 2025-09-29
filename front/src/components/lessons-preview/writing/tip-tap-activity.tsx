import {
  type ChangeEvent,
  type FormEvent,
  useRef,
  useState,
  useEffect,
} from "react";
import type { Editor } from "@tiptap/react";
import toast from "react-hot-toast";
import useHttp from "../../../hooks/use-http";
import { useAutosave } from "../../../hooks/use-autosave";
import Modal from "../../UI/modal/modal";
import TiptapEditor from "./tiptap-simple-editor/tiptap-editor";
import AutosaveIndicator from "./autosave-indicator";
import { Activity } from "../../../utils/interfaces/activity";

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
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showAutosaveIndicator, setShowAutosaveIndicator] =
    useState<boolean>(false);

  const [isEditingActivity, setEditingActivity] =
    useState<boolean>(isNewActivity);

  const [title, setTitle] = useState<string>(activity?.title || "");
  const [editorContent, setEditorContent] = useState<string>(
    activity?.content || ""
  );

  const editorRef = useRef<Editor | null>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Hook d'autosave
  const { lastAutosaveTime, restoreAutosavedContent, clearStorage } =
    useAutosave({
      title,
      content: editorContent,
      parentId,
      activityId: activity?.id,
      isNewActivity,
    });

  const titleHasError = !(title && title.length > 0);

  // Effet pour gérer l'édition depuis l'extérieur
  useEffect(() => {
    if (shouldStartEdit && !isEditingActivity) {
      setEditingActivity(true);
    } else if (forceStopEdit && isEditingActivity && !shouldStartEdit) {
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
    // Add a small delay to ensure DOM is fully rendered before focusing
    if (showModal) {
      setTimeout(() => {
        if (titleInputRef.current) {
          titleInputRef.current.focus();
        }
      }, 100);
    }
  }, [showModal]);

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

  const handleSubmitSave = (e: FormEvent) => {
    e.preventDefault();
    // save as file
    const applyData = () => {
      toast.success(
        `Activité ${isNewActivity ? "créée" : "modifiée"} avec succès`
      );
      // Nettoie l'autosave après sauvegarde réussie
      clearStorage();
      setShowModal(false);

      // Pour les nouvelles activités, fermer l'éditeur et rafraîchir
      if (isNewActivity) {
        onCloseTipTapEditor?.();
        onRefreshAllData?.();
      } else {
        // Pour les activités existantes, juste sortir du mode édition
        setEditingActivity(false);
        // Rafraîchir les données après un petit délai pour éviter les conflits d'état
        setTimeout(() => {
          onRefreshAllData?.();
        }, 100);
      }
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
    );
  };

  return (
    <>
      {showModal ? (
        <Modal
          title="Sauvegarder l'activité"
          leftLabel="Annuler"
          onMinimizeClick={() => setShowModal(false)}
        >
          <form
            onSubmit={handleSubmitSave}
            className="flex gap-4 items-center pt-10 px-5"
          >
            <label className="label" htmlFor="activity-title">
              Titre de l'activité
            </label>
            <input
              id="activity-title"
              ref={titleInputRef}
              value={title}
              onChange={onChangeTitle}
              type="text"
              className="input input-sm input-bordered"
              placeholder="obligatoire"
            />
            <button
              type="submit"
              className="btn btn-sm btn-success"
              disabled={titleHasError}
            >
              {isNewActivity ? "Créer" : "Modifier"}
            </button>
          </form>
        </Modal>
      ) : null}

      {/* Indicateur d'autosave */}
      <AutosaveIndicator
        isVisible={showAutosaveIndicator}
        lastSaveTime={lastAutosaveTime}
      />

      <div className="mt-4 w-[100%] bg-base-200 rounded-lg p-4">
        <TiptapEditor
          editorRef={editorRef}
          initialValue={editorContent || activity?.content}
          isEditingActivity={isEditingActivity}
          onCloseEditor={handleCloseEditor}
          setEditingActivity={setEditingActivity}
          onSave={() => setShowModal(true)}
          onContentChange={updateEditorContent}
        />
      </div>
    </>
  );
};

export default TipTapActivity;
