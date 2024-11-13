/* eslint-disable @typescript-eslint/no-explicit-any */
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import QuillToolbar, { formats } from "./editor-toolbar";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Wrapper from "../UI/wrapper/wrapper.component";
import useHttp from "../../hooks/use-http";
import { Loader2 } from "lucide-react";
import Field from "../UI/forms/field";
import FieldArea from "../UI/forms/field-area";
import useForm from "../UI/forms/hooks/use-form";
import { activiteMetaDataSchema } from "../../lib/validation/lesson/activite-video";
import { ZodError } from "zod";
import { validationErrors } from "../../helpers/validate";
import { toast } from "react-hot-toast";

type EditorProps = {
  title?: string;
  description?: string;
  content?: string;
  isSubmitting: boolean;
  onSubmit: (
    description: string,
    value: string,
    title: string,
    type: string
  ) => void;
  onCancel: () => void;
};

export const Editor = ({
  title,
  description,
  content: initialContent,
  isSubmitting,
  onSubmit,
  onCancel,
}: EditorProps) => {
  const [editorContent, setEditorContent] = useState<string>("");
  const quillRef = useRef<ReactQuill>(null);
  const { sendRequest } = useHttp();

  const { errors, values, onChangeValue, onValidationErrors } = useForm({
    title: title && title !== undefined ? title : "",
    description: description && description !== undefined ? description : "",
  });

  // Initialize editor content
  useEffect(() => {
    if (initialContent) {
      setEditorContent(initialContent);
    }
    if (title) {
      onChangeValue("title", title);
    }
    if (description) {
      onChangeValue("description", description);
    }
  }, [initialContent, title, description, onChangeValue]);

  const handleSubmit = async () => {
    try {
      // Validate form data
      activiteMetaDataSchema.parse(values);

      // Get clean HTML content from editor
      const cleanHtml = quillRef.current?.getEditor().root.innerHTML || "";

      // Submit form data
      onSubmit(
        values.description,
        cleanHtml, // Send clean HTML instead of raw editor content
        values.title,
        "text"
      );
    } catch (error) {
      if (error instanceof ZodError) {
        onValidationErrors(validationErrors(error));
        toast.error("Veuillez remplir tous les champs obligatoires");
      } else {
        toast.error("Une erreur est survenue");
      }
    }
  };

  const imageHandler = useCallback(async () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await sendRequest({
          path: "/activity/blog-image",
          method: "post",
          body: formData,
        });

        if (response?.response && quillRef.current) {
          const range = quillRef.current.getEditor().getSelection();
          quillRef.current
            .getEditor()
            .insertEmbed(range?.index || 0, "image", response.response);
        }
      } catch (error) {
        toast.error("Échec du téléchargement de l'image");
      }
    };

    input.click();
  }, [sendRequest]);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: "#toolbar",
        handlers: { image: imageHandler },
      },
      history: {
        delay: 500,
        maxStack: 100,
        userOnly: true,
      },
    }),
    [imageHandler]
  );

  return (
    <div className="my-8 flex flex-col gap-y-4">
      <Wrapper>
        <span className="flex flex-col gap-y-2">
          <h2 className="text-lg font-bold">Informations</h2>
          <form className="flex flex-col gap-y-4">
            <Field
              name="title"
              label="Titre *"
              data={{ values, errors, onChangeValue }}
            />
            <FieldArea
              name="description"
              label="Description *"
              data={{ values, errors, onChangeValue }}
            />
          </form>
        </span>
      </Wrapper>

      <Wrapper>
        <div className="text-editor text-black bg-white">
          <QuillToolbar />
          <ReactQuill
            ref={quillRef}
            className="min-h-[50vh]"
            theme="snow"
            value={editorContent}
            onChange={setEditorContent}
            placeholder="Écrivez quelque chose..."
            modules={modules}
            formats={formats}
          />
        </div>
      </Wrapper>

      <div className="flex justify-between mt-4">
        <button
          type="button"
          className="btn btn-sm btn-outline btn-primary"
          onClick={onCancel}
        >
          Annuler
        </button>
        <button
          type="button"
          className="btn btn-sm btn-primary flex items-center gap-x-2"
          disabled={isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting && <Loader2 className="animate-spin" />}
          Valider
        </button>
      </div>
    </div>
  );
};

export default Editor;
