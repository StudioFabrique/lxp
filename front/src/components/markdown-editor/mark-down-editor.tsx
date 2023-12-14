/* eslint-disable @typescript-eslint/no-explicit-any */
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import QuillToolbar, { formats, modules } from "./editor-toolbar";
import { useState } from "react";
import Wrapper from "../UI/wrapper/wrapper.component";

interface EditorProps {
  content?: string;
  onSubmit: (value: any) => void;
  onCancel: () => void;
}

export const Editor = ({ content = "", onSubmit, onCancel }: EditorProps) => {
  const [value, setValue] = useState<string>(content);

  const handleSubmit = () => {
    onSubmit(value);
  };

  return (
    <div className="my-8">
      <Wrapper>
        <div className="text-editor text-black bg-white">
          <QuillToolbar />
          <ReactQuill
            className="min-h-[50vh]"
            theme="snow"
            value={value}
            onChange={setValue}
            placeholder={"Write something awesome..."}
            modules={modules}
            formats={formats}
          />
        </div>
      </Wrapper>
      <div className="flex justify-between mt-4">
        <button className="btn btn-outline btn-primary" onClick={onCancel}>
          Annuler
        </button>
        <button className="btn btn-primary" onClick={handleSubmit}>
          Valider
        </button>
      </div>
    </div>
  );
};

export default Editor;
