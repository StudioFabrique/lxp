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
import { fromHtmlToMarkdown } from "../../helpers/html-parser";

type Props = {
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

export const Editor = (props: Props) => {
  console.log("toto", props.content);
  const [value, setValue] = useState<string>("");
  const quillRef = useRef<any>(null);
  const { sendRequest } = useHttp();
  const { errors, values, onChangeValue, onValidationErrors } = useForm({
    title: "",
    description: "",
  });
  const data = { values, errors, onChangeValue };

  useEffect(() => {
    if (props.content) {
      setValue(props.content);
    }
    if (props.title) {
      onChangeValue("title", props.title);
    }
    if (props.description) {
      onChangeValue("description", props.description);
    }
  }, [props.content, props.title, props.description, onChangeValue]);

  const handleSubmit = async () => {
    try {
      activiteMetaDataSchema.parse(values);
    } catch (error: any) {
      if (error instanceof ZodError) {
        const errors = validationErrors(error);
        onValidationErrors(errors);
        return;
      }
    }
    props.onSubmit(
      values.description,
      await fromHtmlToMarkdown(value),
      values.title,
      "text"
    );
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

  console.log({ title: props.title, description: props.description, value });

  return (
    <div className="my-8 flex flex-col gap-y-4">
      <Wrapper>
        <span className="flex flex-col gap-y-2">
          <h2 className="text-lg font-bold">Informations</h2>
          <form className="flex flex-col gap-y-4">
            <Field name="title" label="Titre *" data={data} />
            <FieldArea name="description" data={data} label="Description *" />
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
            value={value}
            onChange={setValue}
            placeholder={"Write something awesome..."}
            modules={modules}
            formats={formats}
          />
        </div>
      </Wrapper>
      <div className="flex justify-between mt-4">
        <button
          className="btn btn-sm btn-outline btn-primary"
          onClick={props.onCancel}
        >
          Annuler
        </button>
        <button
          className="btn btn-sm btn-primary flex items-center gap-x-2"
          disabled={props.isSubmitting}
          onClick={handleSubmit}
        >
          {props.isSubmitting ? <Loader2 className="animate-spin" /> : null}
          Valider
        </button>
      </div>
    </div>
  );
};

export default Editor;
