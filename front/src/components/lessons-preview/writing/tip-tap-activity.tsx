import { ChangeEvent, useRef, useState } from "react";
import { Editor } from "@tiptap/react";
import TiptapSimpleEditor from "./tiptap-simple-editor/tiptap-simple-editor";
import toast from "react-hot-toast";
import useHttp from "../../../hooks/use-http";

type TipTapActivityProps = {
  lessonId: number;
  value?: string;
  isNewActivity?: boolean;
  onCloseTipTapEditor?: () => void;
};

const TipTapActivity = ({
  lessonId,
  value,
  isNewActivity = false,
  onCloseTipTapEditor,
}: TipTapActivityProps) => {
  const { sendRequest } = useHttp();

  const [isEditingActivity, setEditingActivity] =
    useState<boolean>(isNewActivity);
  const [title, setTitle] = useState<string>("");

  const editorRef = useRef<Editor | null>(null);

  const titleHasError = !(title && title.length > 0); /*|| !title incorrect*/

  const onChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value);
  };

  const handleSave = () => {
    // save as file
    const applyData = () => {
      toast.success("Activité créée avec succès");
      onCloseTipTapEditor && onCloseTipTapEditor();
    };

    const value = editorRef.current?.getHTML();

    sendRequest(
      {
        path: `/activity/text/${lessonId}`,
        method: "post",
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
    <div className="mt-4 flex flex-col">
      <TiptapSimpleEditor
        editorRef={editorRef}
        initialValue={value}
        isEditingActivity={isEditingActivity}
        onCloseEditor={onCloseTipTapEditor}
        setEditingActivity={setEditingActivity}
      />

      {/* bottom menu */}
      {isEditingActivity ? (
        <div className="mt-5 flex justify-between gap-5 bg-base-200 shadow-lg rounded-lg py-2 px-4">
          <span className="flex gap-4 items-center">
            <label className="label">Titre de l'activité</label>
            <input
              value={title}
              onChange={onChangeTitle}
              type="text"
              className="input input-sm input-bordered"
              placeholder="obligatoire"
            />
          </span>
          <button
            className="btn btn-sm btn-success"
            disabled={titleHasError}
            onClick={handleSave}
          >
            Créer
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default TipTapActivity;
