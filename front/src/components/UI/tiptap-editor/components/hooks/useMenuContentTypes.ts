import { type Editor, useEditorState } from "@tiptap/react";
import type { ContentPickerOptions } from "../dropdowns/ContentTypePicker";
import { useCallback, useEffect, useState } from "react";
import useHttp from "../../../../../hooks/use-http";
import { BASE_URL } from "../../../../../config/urls";

export const useMenuContentTypes = (
  editor: Editor,
  imageInputRef: React.RefObject<HTMLInputElement>
) => {
  const { sendRequest } = useHttp();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isImageUploadPending, setIsLoading] = useState<boolean>(false);
  const [imageSize, setImageSize] = useState<"small" | "medium" | "large">(
    "small"
  );

  const handleImageUpload = useCallback(async () => {
    console.log(imageFile);

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

      const imageUrl = `${BASE_URL}${response.response}`;

      setIsLoading(false);
      editor.commands.insertContent({
        type: "image",
        attrs: {
          src: imageUrl,
          width:
            imageSize === "small" ? 100 : imageSize === "medium" ? 200 : 300,
          height:
            imageSize === "small" ? 100 : imageSize === "medium" ? 200 : 300,
        },
      });

      // add a line below the image
      editor.commands.enter();
    }
  }, [editor, imageFile, imageSize, sendRequest]);

  const handleImageUploadFromURL = useCallback(
    async (url: string) => {
      setIsLoading(true);

      setIsLoading(false);
      // insert the image
      editor.commands.insertContent({
        type: "image",
        attrs: {
          src: url,
          width:
            imageSize === "small" ? 100 : imageSize === "medium" ? 200 : 300,
          height:
            imageSize === "small" ? 100 : imageSize === "medium" ? 200 : 300,
        },
      });

      // add a line below the image
      editor.commands.enter();
    },
    [editor, imageSize]
  );

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
      selector: (/*ctx*/): ContentPickerOptions => [
        // {
        //   type: "category",
        //   label: "Insertion",
        //   id: "insert",
        // },
        // {
        //   icon: "Table",
        //   onClick: () =>
        //     ctx.editor.commands.insertTable({
        //       rows: 3,
        //       cols: 3,
        //       withHeaderRow: true,
        //     }),
        //   id: "table",
        //   disabled: () => false,
        //   isActive: () => editor.isActive("table"),
        //   label: "Tableau",
        //   type: "option",
        // },
      ],
    }),
    isImageUploadPending,
    onImageUploadFromURL: handleImageUploadFromURL,
    onSetImageSize: setImageSize,
  };
};
