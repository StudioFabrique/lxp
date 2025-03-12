/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { ForwardedRef, forwardRef, useCallback } from "react";

import useHttp from "../../hooks/use-http";
import Editor from "../edit-lesson/text-editor/editor";

type Props = {
  content: string;
};

const initialValue = "";

const BlogEditor = forwardRef(
  (props: Props, ref: ForwardedRef<TinyMCEEditor>) => {
    const { sendRequest } = useHttp();

    const handleInit = (_evt: unknown, editor: TinyMCEEditor) => {
      if (ref && typeof ref === "function") {
        ref(editor);
      } else if (ref && "current" in ref) {
        ref.current = editor;
      }
    };

    /*  const imageHandler = useCallback(async () => {
      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "image/*");

      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        try {
          // Upload de l'image
          const response = await sendRequest({
            path: "/activity/blog-image",
            method: "post",
            body: formData,
          });

          // Insertion de l'image dans l'éditeur
          if (response?.response && ref && "current" in ref) {
            const range = ref.current.getEditor().getSelection();
            ref.current
              .getEditor()
              .insertEmbed(
                range?.index || 0,
                "image",
                process.env.NODE_ENV === "development"
                  ? "http://localhost:5001/" + response.response
                  : response.response
              );
          }
        } catch (error) {
          toast.error("Échec du téléchargement de l'image");
        }
      };

      input.click();
    }, [sendRequest]);*/

    return <Editor />;
  }
);

BlogEditor.displayName = "BlogEditor";

export default BlogEditor;
