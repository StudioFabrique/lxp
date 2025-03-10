/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Editor } from "@tinymce/tinymce-react";
import { ForwardedRef, forwardRef, useCallback } from "react";
import { Editor as TinyMCEEditor } from "tinymce";
import useHttp from "../../hooks/use-http";

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

    const uploadImage = useCallback(
      async (blobInfo: any, _progress: any) => {
        try {
          const formData = new FormData();
          formData.append("image", blobInfo.blob(), blobInfo.filename());

          const response = await sendRequest({
            path: "/activity/blog-image",
            method: "post",
            body: formData,
          });
          console.log({ response });

          const imageUrl = "http://localhost:5001" + response.response;

          return imageUrl;
        } catch (error) {
          console.error("Erreur upload image:", error);
          return "error";
        }
      },
      [sendRequest]
    );

    return (
      <Editor
        onInit={handleInit}
        initialValue={props.content || initialValue}
        apiKey="b84dqku1gt27ks3ilswsa2rhnl2pio95ge1obf5orx62nwf7"
        init={{
          language: "fr_FR",
          base_url: "http://localhost:3200/tinymce",
          placeholder: "Commencez à éditer le contenu de l'activité ...",
          language_url: "http://localhost:3200/tinymce/langs/fr_FR/fr_FR.js", // Simplified path
          height: 1000,
          menubar: true,
          plugins: [
            "anchor",
            "autolink",
            "charmap",
            "codesample",
            "emoticons",
            "image",
            "link",
            "lists",
            "media",
            "searchreplace",
            "table",
            "visualblocks",
            "wordcount",
            "linkchecker",
          ].join(" "),
          toolbar: [
            "undo redo",
            "blocks fontfamily fontsize",
            "bold italic underline strikethrough",
            "link image",
            "align lineheight",
            "numlist bullist indent outdent",
            "emoticons charmap",
            "removeformat",
          ].join(" | "),
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
          images_upload_handler: uploadImage,
          skin: "oxide",
          content_css: "default",
        }}
      />
    );
  }
);

BlogEditor.displayName = "BlogEditor";

export default BlogEditor;
