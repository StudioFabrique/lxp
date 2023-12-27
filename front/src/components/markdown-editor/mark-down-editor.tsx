/* eslint-disable @typescript-eslint/no-explicit-any */
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import QuillToolbar, { formats } from "./editor-toolbar";
import { useCallback, useMemo, useRef, useState } from "react";
import Wrapper from "../UI/wrapper/wrapper.component";
import useHttp from "../../hooks/use-http";
import { Loader2 } from "lucide-react";

interface EditorProps {
  content?: string;
  isSubmitting: boolean;
  onSubmit: (value: any) => void;
  onCancel: () => void;
}

export const Editor = ({
  content = "",
  isSubmitting,
  onSubmit,
  onCancel,
}: EditorProps) => {
  const [value, setValue] = useState<string>(content);
  const quillRef = useRef<any>(null);
  const { sendRequest } = useHttp();

  const handleSubmit = () => {
    onSubmit(value);
  };

  /**
   * valide l'upload d'image vers le serveur, et ajoute l'url de l'image dans le
   * document markdown en cours d'édition
   */
  const imageHandler = useCallback(async () => {
    const input = document.createElement("input");

    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
    input.onchange = async () => {
      const file: any = input && input.files ? input.files[0] : null;
      const formData = new FormData();
      formData.append("image", file);
      const quillObj = quillRef.current;
      const applyData = (res: any) => {
        const data = res.response;
        const range = quillRef.current.getEditor().getSelection();
        quillObj.getEditor().insertEmbed(range.index, "image", data);
      };
      sendRequest(
        {
          path: "/activity/blog-image",
          method: "post",
          body: formData,
        },
        applyData
      );

      /*       await UploadService.uploadFile(formData)
        .then((res) => {
          let data = get(res, "data.data.url");
          const range = quillObj.getEditorSelection();
          quillObj.getEditor().insertEmbed(range.index, "image", data);
        })
        .catch((err) => {
          message.error("This is an error message");
          return false;
        }); */
    };
  }, [sendRequest]);

  const modules = useMemo(() => {
    return {
      toolbar: {
        container: "#toolbar",
        handlers: {
          image: imageHandler,
        },
      },
      history: {
        delay: 500,
        maxStack: 100,
        userOnly: true,
      },
    };
  }, [imageHandler]);

  return (
    <div className="my-8">
      <Wrapper>
        <div className="text-editor text-black bg-white">
          <QuillToolbar />
          <ReactQuill
            ref={quillRef}
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
        <button
          className="btn btn-primary flex items-center gap-x-2"
          disabled={isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting ? <Loader2 className="animate-spin" /> : null}
          Valider
        </button>
      </div>
    </div>
  );
};

export default Editor;
