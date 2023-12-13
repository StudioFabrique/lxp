import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import QuillToolbar, { formats, modules } from "./editor-toolbar";
import Wrapper from "../../UI/wrapper/wrapper.component";

interface EditorProps {
  value: string;
  onChangeValue: (value: string) => void;
}

export const Editor = ({ value, onChangeValue }: EditorProps) => {
  console.log(value);

  return (
    <div className="my-8">
      <Wrapper>
        <div className="text-editor text-black bg-white">
          <QuillToolbar />
          <ReactQuill
            className="min-h-[50vh]"
            theme="snow"
            value={value}
            onChange={onChangeValue}
            placeholder={"Write something awesome..."}
            modules={modules}
            formats={formats}
          />
        </div>
      </Wrapper>
    </div>
  );
};

export default Editor;
