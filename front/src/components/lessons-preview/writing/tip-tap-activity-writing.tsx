import { Settings } from "lucide-react";
import { ChangeEvent, useState } from "react";
import TipTapEditor from "./tiptap-template/tiptap-editor";

type TipTapActivityWritingProps = {
  onCloseTipTapEditor: () => void;
};

const TipTapActivityWriting = ({
  onCloseTipTapEditor,
}: TipTapActivityWritingProps) => {
  // const extensions = [Document, Text, Paragraph];
  const [title, setTitle] = useState<string>();

  const onChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value);
  };

  return (
    <div className="mt-4 flex flex-col gap-4">
      <TipTapEditor onCloseEditor={onCloseTipTapEditor} />

      {/* bottom menu */}
      <div className="mt-5 flex justify-between gap-5 bg-white shadow-lg rounded-lg p-2 mb-4">
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
        <button className="btn btn-success" disabled>
          Créer
        </button>
      </div>
    </div>
  );
};

export default TipTapActivityWriting;
