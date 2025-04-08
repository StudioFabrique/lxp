import { Settings, X } from "lucide-react";
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
      {/* Close button */}
      <button className="btn btn-sm self-end" onClick={onCloseTipTapEditor}>
        <X /> Annuler
      </button>

      <TipTapEditor />

      {/* bottom menu */}
      <div className="mt-5 flex justify-between gap-5 bg-white shadow-lg rounded-lg p-2 mb-4">
        <span className="flex gap-4 items-center p-2">
          <button className="btn btn-sm">
            <Settings /> Personnaliser
          </button>
        </span>
        <span className="flex gap-4 items-center">
          <div className="flex gap-4 items-center">
            <span className="flex gap-2 items-center">
              <label className="label">Titre de l'activité</label>
              <input
                value={title}
                onChange={onChangeTitle}
                type="text"
                className="input input-bordered"
                placeholder="obligatoire"
              />
            </span>
          </div>
          <button className="btn btn-success" disabled>
            Sauvegarder
          </button>
        </span>
      </div>
    </div>
  );
};

export default TipTapActivityWriting;
