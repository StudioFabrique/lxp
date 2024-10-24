import { Editor } from "@tinymce/tinymce-react";
import { ForwardedRef, forwardRef } from "react";
import { Editor as TinyMCEEditor } from "tinymce";

type Props = {
  content: string;
};

const initialValue = "";

const BlogEditor = forwardRef(
  (props: Props, ref: ForwardedRef<TinyMCEEditor>) => {
    const handleInit = (_evt: unknown, editor: TinyMCEEditor) => {
      if (ref && typeof ref === "function") {
        ref(editor);
      } else if (ref && "current" in ref) {
        ref.current = editor;
      }
    };

    return (
      <Editor
        apiKey={import.meta.env.VITE_TINY_KEY}
        onInit={handleInit}
        initialValue={props.content || initialValue}
        init={{
          placeholder: "Commencez à éditer le contenu de l'activité ...",
          language: "fr_FR",
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
        }}
      />
    );
  },
);

BlogEditor.displayName = "BlogEditor";

export default BlogEditor;
