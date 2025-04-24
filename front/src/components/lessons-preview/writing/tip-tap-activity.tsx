import { type ChangeEvent, useRef, useState } from "react";
import type { Editor } from "@tiptap/react";
import TiptapSimpleEditor from "./tiptap-simple-editor/tiptap-simple-editor";
import toast from "react-hot-toast";
import useHttp from "../../../hooks/use-http";
import Modal from "../../UI/modal/modal";

type TipTapActivityProps = {
  lessonId: number;
  value?: string;
  isNewActivity?: boolean;
  onCloseTipTapEditor?: () => void;
  onRefreshAllData?: () => void;
};

const TipTapActivity = ({
  lessonId,
  value,
  isNewActivity = false,
  onCloseTipTapEditor,
  onRefreshAllData,
}: TipTapActivityProps) => {
  const { sendRequest } = useHttp(true);
  const [showModal, setShowModal] = useState<boolean>(false);

  const [isEditingActivity, setEditingActivity] =
    useState<boolean>(isNewActivity);

  const [title, setTitle] = useState<string>("");

  const editorRef = useRef<Editor | null>(null);

  const titleHasError = !(title && title.length > 0); /*|| !title incorrect*/

  const onChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value);
  };

  const handleSubmitSave = () => {
    // save as file
    const applyData = () => {
      toast.success("Activité créée avec succès");
      setShowModal(false);
      onCloseTipTapEditor?.();
      onRefreshAllData?.();
    };

    const value = editorRef.current?.getHTML();

    sendRequest(
      {
        path: `/activity/text/${lessonId}`,
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
          <span className="flex gap-4 items-center pt-10 px-5">
            <label className="label" htmlFor="activity-title">
              Titre de l'activité
            </label>
            <input
              id="activity-title"
              value={title}
              onChange={onChangeTitle}
              type="text"
              className="input input-sm input-bordered"
              placeholder="obligatoire"
            />
            <button
              type="button"
              className="btn btn-sm btn-success"
              disabled={titleHasError}
              onClick={handleSubmitSave}
            >
              Créer
            </button>
          </span>
        </Modal>
      ) : null}
      <div className="mt-4 w-[100%]">
        <TiptapSimpleEditor
          editorRef={editorRef}
          initialValue={value}
          isEditingActivity={isEditingActivity}
          onCloseEditor={onCloseTipTapEditor}
          setEditingActivity={setEditingActivity}
          onSave={() => setShowModal(true)}
        />

        {/* bottom menu */}
        {/* {isEditingActivity ? (
        <div className="mt-5 flex justify-between gap-5 bg-base-200 shadow-lg rounded-lg py-2 px-4">
          <span className="flex gap-4 items-center">
            <label className="label" htmlFor="activity-title">
              Titre de l'activité
            </label>
            <input
              id="activity-title"
              value={title}
              onChange={onChangeTitle}
              type="text"
              className="input input-sm input-bordered"
              placeholder="obligatoire"
            />
          </span>
          <button
            type="button"
            className="btn btn-sm btn-success"
            disabled={titleHasError}
            onClick={handleSave}
          >
            Créer
          </button>
        </div>
      ) : null} */}
      </div>
    </>
  );
};

export default TipTapActivity;
