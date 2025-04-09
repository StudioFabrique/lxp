import { Editor, useEditorState } from "@tiptap/react";
import { ContentPickerOptions } from "../dropdowns/ContentTypePicker";
import { useCallback, useEffect, useState } from "react";

export const useMenuContentTypes = (
  editor: Editor,
  imageInputRef: React.RefObject<HTMLInputElement>,
) => {
  const [imageFile, setImageFile] = useState<File>();
  // const [imageUrl, setImageUrl] = useState<string>();

  const handleImageUpload = useCallback(() => {
    if (imageFile) {
      console.log({ imageFile });
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        // setImageUrl(url);
        editor.chain().focus().setImage({ src: url }).run();
      };
      reader.readAsDataURL(imageFile);
    }
  }, [editor, imageFile]);

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

  return useEditorState({
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
  });
};
