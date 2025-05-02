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
import Modal from "../../UI/modal/modal";
import TiptapEditor from "./tiptap-simple-editor/tiptap-editor";

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
};

const TipTapActivity = ({
  lessonId,
  activity,
  isNewActivity = false,
  isAnyActivityBeingEdited = false,
  onCloseTipTapEditor,
  onRefreshAllData,
  onActivityEditChange,
}: TipTapActivityProps) => {
  const { sendRequest } = useHttp(true);
  const [showModal, setShowModal] = useState<boolean>(false);

  const [isEditingActivity, setEditingActivity] =
    useState<boolean>(isNewActivity);

  const [title, setTitle] = useState<string>(activity?.title || "");

  const editorRef = useRef<Editor | null>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const titleHasError = !(title && title.length > 0); /*|| !title incorrect*/

  const onChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value);
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

  const handleSubmitSave = (e: FormEvent) => {
    e.preventDefault();
    // save as file
    const applyData = () => {
      toast.success(
        `Activité ${isNewActivity ? "créée" : "modifiée"} avec succès`,
      );
      setShowModal(false);
      onCloseTipTapEditor?.();
      onRefreshAllData?.();
      setEditingActivity(false);
    };

    const value = editorRef.current?.getHTML();

    sendRequest(
      {
        path: `/activity/text/${isNewActivity ? lessonId : activity?.id}`,
        method: isNewActivity ? "post" : "put",
        body: {
          description: "description",
          value,
          title,
        },
      },
      applyData,
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
      <div className="mt-4 w-[100%]">
        <TiptapEditor
          editorRef={editorRef}
          initialValue={activity?.content}
          isEditingActivity={isEditingActivity}
          disableEditButton={isAnyActivityBeingEdited}
          onCloseEditor={onCloseTipTapEditor}
          setEditingActivity={setEditingActivity}
          onSave={() => setShowModal(true)}
        />
      </div>
    </>
  );
};

export default TipTapActivity;
