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

type Activity = {
  id: number;
  content: string;
  title?: string;
};

type TipTapActivityProps = {
  lessonId: number;
  activity?: Activity;
  isNewActivity?: boolean;
  isAnyActivityBeingEdited?: boolean;
  onCloseTipTapEditor?: () => void;
  onRefreshAllData?: () => void;
  onActivityEditChange?: (isEditing: boolean) => void;
  onDeleteActivity?: (activityId: number) => void;
};

const TipTapActivity = ({
  lessonId,
  activity,
  isNewActivity = false,
  isAnyActivityBeingEdited = false,
  onCloseTipTapEditor,
  onRefreshAllData,
  onActivityEditChange,
  onDeleteActivity,
}: TipTapActivityProps) => {
  const { sendRequest } = useHttp(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
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
      lessonId,
      activityId: activity?.id,
      isNewActivity,
    });

  const titleHasError = !(title && title.length > 0);

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
      if (autosavedData.wasRestored) {
        setTitle(autosavedData.title);
        setEditorContent(autosavedData.content);
        setShowAutosaveIndicator(true);
        toast("Contenu restauré depuis la sauvegarde automatique", {
          duration: 3000,
        });
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

    // enlever les espaces inutiles à la fin sur le texte
    const trimmedText = editorRef.current?.getText()?.trim();
    // Recréer le HTML avec le texte nettoyé
    if (trimmedText && editorRef.current) {
      editorRef.current.commands.setContent(trimmedText);
    }
    const value = editorRef.current?.getHTML();

    sendRequest(
      {
        path: `/activity/text/${isNewActivity ? lessonId : activity?.id}`,
        method: isNewActivity ? "post" : "put",
        body: {
          description: "description",
          value,
          title: title.trim(),
        },
      },
      applyData
    );
  };

  const handleDeleteActivity = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteActivity = () => {
    if (!activity?.id) return;

    // Suppression instantanée dans le front
    setShowDeleteModal(false);
    onDeleteActivity?.(activity.id);
    toast.success("Activité supprimée");

    // Appel au backend en arrière-plan sans bloquer l'interface
    const applyData = () => {
      // Backend confirmé - pas besoin d'action supplémentaire
    };

    sendRequest(
      {
        path: `/activity/text/${activity.id}`,
        method: "delete",
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

      {showDeleteModal ? (
        <Modal
          title="Supprimer l'activité"
          leftLabel="Annuler"
          onMinimizeClick={() => setShowDeleteModal(false)}
        >
          <div className="flex flex-col gap-4 items-center pt-10 px-5">
            <p className="text-center">
              Êtes-vous sûr de vouloir supprimer cette activité ? Cette action
              est irréversible.
            </p>
            <div className="flex gap-4">
              <button
                className="btn btn-sm btn-ghost"
                onClick={() => setShowDeleteModal(false)}
              >
                Annuler
              </button>
              <button
                className="btn btn-sm btn-error"
                onClick={confirmDeleteActivity}
              >
                Supprimer
              </button>
            </div>
          </div>
        </Modal>
      ) : null}

      {/* Indicateur d'autosave */}
      <AutosaveIndicator
        isVisible={showAutosaveIndicator}
        lastSaveTime={lastAutosaveTime}
      />

      <div className="mt-4 w-[100%]">
        <TiptapEditor
          editorRef={editorRef}
          initialValue={editorContent || activity?.content}
          isEditingActivity={isEditingActivity}
          disableEditButton={isAnyActivityBeingEdited}
          onCloseEditor={handleCloseEditor}
          setEditingActivity={setEditingActivity}
          onSave={() => setShowModal(true)}
          onContentChange={updateEditorContent}
          onDeleteActivity={!isNewActivity ? handleDeleteActivity : undefined}
        />
      </div>
    </>
  );
};

export default TipTapActivity;
