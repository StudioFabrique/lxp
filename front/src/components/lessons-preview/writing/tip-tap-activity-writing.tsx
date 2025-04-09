import { ChangeEvent, useState } from "react";
import TiptapSimpleEditor from "./tiptap-simple-editor/tiptap-simple-editor";

type TipTapActivityWritingProps = {
  onCloseTipTapEditor: () => void;
};

const TipTapActivityWriting = ({
  onCloseTipTapEditor,
}: TipTapActivityWritingProps) => {
  const [title, setTitle] = useState<string>();

  const titleHasError = !(title && title.length > 0); /*|| !title incorrect*/

  const onChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value);
  };

  return (
    <div className="mt-4 flex flex-col">
      <TiptapSimpleEditor onCloseEditor={onCloseTipTapEditor} />

      {/* bottom menu */}
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
        <button className="btn btn-sm btn-success" disabled={titleHasError}>
          Créer
        </button>
      </div>
    </div>
  );
};

export default TipTapActivityWriting;
