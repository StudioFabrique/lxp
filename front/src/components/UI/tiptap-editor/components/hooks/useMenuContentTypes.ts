import { type Editor, useEditorState } from "@tiptap/react";
import type { ContentPickerOptions } from "../dropdowns/ContentTypePicker";
import { useCallback, useEffect, useState } from "react";
import useHttp from "../../../../../hooks/use-http";
import { BASE_URL } from "../../../../../config/urls";

// Add this interface
interface QueuedImage {
  file: File | null;
  url: string | null;
  size: "small" | "medium" | "large";
  tempId: string; // temporary placeholder ID
}

export const useMenuContentTypes = (
  editor: Editor,
  imageInputRef: React.RefObject<HTMLInputElement>
) => {
  const { sendRequest } = useHttp();
  const [imageQueue, setImageQueue] = useState<QueuedImage[]>([]);
  const [isImageUploadPending, setIsLoading] = useState<boolean>(false);
  const [imageSize, setImageSize] = useState<"small" | "medium" | "large">(
    "small"
  );

  // Insert image with temporary placeholder
  const handleImageSelect = useCallback(
    (file: File) => {
      const tempId = `temp-${Date.now()}-${Math.random()}`;
      const tempUrl = URL.createObjectURL(file);

      // Add to queue
      setImageQueue((prev) => [
        ...prev,
        {
          file,
          url: null,
          size: imageSize,
          tempId,
        },
      ]);

      // Insert with temporary URL
      editor.commands.insertContent({
        type: "image",
        attrs: {
          src: tempUrl,
          "data-temp-id": tempId, // identifier for later replacement
          width:
            imageSize === "small"
              ? "25%"
              : imageSize === "medium"
              ? "50%"
              : "100%",
        },
      });

      editor.commands.enter();
    },
    [editor, imageSize]
  );

  const handleImageUploadFromURL = useCallback(
    (url: string) => {
      const tempId = `temp-url-${Date.now()}`;

      setImageQueue((prev) => [
        ...prev,
        {
          file: null,
          url,
          size: imageSize,
          tempId,
        },
      ]);

      editor.commands.insertContent({
        type: "image",
        attrs: {
          src: url,
          "data-temp-id": tempId,
          width:
            imageSize === "small"
              ? "25%"
              : imageSize === "medium"
              ? "50%"
              : "100%",
        },
      });

      editor.commands.enter();
    },
    [editor, imageSize]
  );

  // Upload all queued images asynchronously
  const uploadAllImages = useCallback(async () => {
    if (imageQueue.length === 0) return;

    setIsLoading(true);

    try {
      // Upload all images in parallel
      const uploadPromises = imageQueue.map(async (queuedImage) => {
        // Skip if already uploaded (URL provided)
        if (queuedImage.url) {
          return { tempId: queuedImage.tempId, url: queuedImage.url };
        }

        if (!queuedImage.file) return null;

        const formData = new FormData();
        formData.append("image", queuedImage.file, queuedImage.file.name);

        const response = await sendRequest({
          path: "/activity/blog-image",
          method: "post",
          body: formData,
        });

        const imageUrl = `${BASE_URL}${response.response}`;
        return { tempId: queuedImage.tempId, url: imageUrl };
      });

      const results = await Promise.all(uploadPromises);

      // Replace temporary URLs with real URLs in editor content
      results.forEach((result) => {
        if (!result) return;

        const { state, view } = editor;
        const { doc } = state;

        doc.descendants((node, pos) => {
          if (
            node.type.name === "image" &&
            node.attrs["data-temp-id"] === result.tempId
          ) {
            const transaction = state.tr.setNodeMarkup(pos, undefined, {
              ...node.attrs,
              src: result.url,
              "data-temp-id": undefined, // remove temp ID
            });
            view.dispatch(transaction);
          }
        });
      });

      // Clear the queue
      setImageQueue([]);
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setIsLoading(false);
    }
  }, [imageQueue, editor, sendRequest]);

  useEffect(() => {
    const current = imageInputRef.current;
    const handleChange = () => {
      if (!current?.files) return;
      handleImageSelect(current.files[0]);
    };

    current?.addEventListener("change", handleChange);
    return () => {
      current?.removeEventListener("change", handleChange);
    };
  }, [imageInputRef, handleImageSelect]);

  return {
    menuContentOptions: useEditorState({
      editor,
      selector: (): ContentPickerOptions => [],
    }),
    isImageUploadPending,
    onImageUploadFromURL: handleImageUploadFromURL,
    onSetImageSize: setImageSize,
    uploadAllImages, // Export this function
  };
};
