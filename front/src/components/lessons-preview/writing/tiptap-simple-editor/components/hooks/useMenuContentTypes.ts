import { Editor, useEditorState } from "@tiptap/react";
import { ContentPickerOptions } from "../dropdowns/ContentTypePicker";
import { useCallback, useEffect, useState } from "react";
import useHttp from "../../../../../../hooks/use-http";

export const useMenuContentTypes = (
  editor: Editor,
  imageInputRef: React.RefObject<HTMLInputElement>,
) => {
  const { sendRequest } = useHttp();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isImageUploadPending, setIsLoading] = useState<boolean>(false);

  const handleImageUpload = useCallback(async () => {
    if (imageFile) {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("image", imageFile, imageFile.name);
      setImageFile(null);

      const response = await sendRequest({
        path: "/activity/blog-image",
        method: "post",
        body: formData,
      });

      const imageUrl =
        process.env.NODE_ENV === "development"
          ? "http://localhost:5001" + response.response
          : response.response;

      setIsLoading(false);
      editor.chain().focus().setImage({ src: imageUrl }).run();
    }
  }, [editor, imageFile, sendRequest]);

  useEffect(() => {
    handleImageUpload();
  }, [handleImageUpload]);

  useEffect(() => {
    const current = imageInputRef.current;
    const handleChange = () => {
      if (!current?.files) return;
      setImageFile(current.files[0]);
    };

    current?.addEventListener("change", handleChange);
    return () => {
      current?.removeEventListener("change", handleChange);
    };
  }, [imageInputRef]);

  return {
    menuContentOptions: useEditorState({
      editor,
      selector: (ctx): ContentPickerOptions => [
        {
          type: "category",
          label: "Insertion",
          id: "insert",
        },
        {
          icon: "PictureInPicture",
          onClick: () => imageInputRef.current?.click(),
          id: "picture",
          disabled: () => !ctx.editor.can().toggleBulletList(),
          isActive: () => ctx.editor.isActive("picture"),
          label: "Image",
          type: "option",
        },
        {
          icon: "Table",
          onClick: () =>
            ctx.editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: false })
              .run(),
          id: "table",
          disabled: () => false,
          isActive: () => editor.isActive("table"),
          label: "Tableau",
          type: "option",
        },
      ],
    }),
    isImageUploadPending,
  };
};
