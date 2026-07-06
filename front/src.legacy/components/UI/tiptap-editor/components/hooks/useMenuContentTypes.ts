import { type Editor, useEditorState } from "@tiptap/react";
import type { ContentPickerOptions } from "../dropdowns/ContentTypePicker";
import { useCallback, useEffect, useRef, useState } from "react";
import useHttp from "../../../../../hooks/use-http";
import { BASE_URL } from "../../../../../config/urls";

interface QueuedImage {
  file: File;
  blobUrl: string; // This needs to match what's in the document
  size: "small" | "medium" | "large";
  tempId: string;
}

export const useMenuContentTypes = (
  editor: Editor,
  imageInputRef: React.RefObject<HTMLInputElement>,
) => {
  const { sendRequest } = useHttp();
  const imageQueue = useRef<QueuedImage[]>([]);
  const [imageSize, setImageSize] = useState<"small" | "medium" | "large">(
    "small",
  );

  const handleImageSelect = useCallback(
    (file: File) => {
      const tempId = `temp-${Date.now()}-${Math.random()}`;
      const blobUrl = URL.createObjectURL(file);

      // Ajout direct dans la réf (ZÉRO re-rendu !)
      imageQueue.current.push({
        file,
        blobUrl,
        size: imageSize,
        tempId,
      });

      // Insert into editor
      editor.commands.insertContent({
        type: "image",
        attrs: {
          src: blobUrl, // Use the same blob URL
          dataTempId: tempId,
          width:
            imageSize === "small"
              ? "25%"
              : imageSize === "medium"
                ? "50%"
                : "100%",
        },
      });
    },
    [editor, imageSize],
  );

  const handleImageUploadFromURL = useCallback(
    (url: string) => {
      // For direct URLs, no need to queue - just insert
      editor.commands.insertContent({
        type: "image",
        attrs: {
          src: url,
          width:
            imageSize === "small"
              ? "25%"
              : imageSize === "medium"
                ? "50%"
                : "100%",
        },
      });
    },
    [editor, imageSize],
  );

  const uploadAllImages = useCallback(async () => {
    if (imageQueue.current.length === 0) {
      console.log("No new images to upload");
      return;
    }

    try {
      const urlMap = new Map<string, string>();

      // Upload all images
      for (const queuedImage of imageQueue.current) {
        const formData = new FormData();
        formData.append("image", queuedImage.file, queuedImage.file.name);

        const response = await sendRequest({
          path: "/activity/blog-image",
          method: "post",
          body: formData,
        });

        const imageUrl = `${BASE_URL}${response.response}`;
        urlMap.set(queuedImage.blobUrl, imageUrl);
      }

      // Create promise that resolves when editor updates
      await new Promise<void>((resolve) => {
        const handler = () => {
          editor.off("update", handler);
          resolve();
        };
        editor.on("update", handler);

        // Fallback timeout
        setTimeout(() => {
          editor.off("update", handler);
          resolve();
        }, 1000);
      });

      // Update all images
      let updatedCount = 0;
      const { tr, doc } = editor.state;
      let transaction = tr;

      doc.descendants((node, pos) => {
        if (node.type.name === "image") {
          const currentSrc = node.attrs.src;

          if (currentSrc && currentSrc.startsWith("blob:")) {
            const newUrl = urlMap.get(currentSrc);
            if (newUrl) {
              console.log(`Replacing ${currentSrc} with ${newUrl}`);
              transaction = transaction.setNodeMarkup(pos, null, {
                ...node.attrs,
                src: newUrl,
                dataTempId: null,
              });
              updatedCount++;
            }
          }
        }
      });

      if (updatedCount > 0) {
        console.log(
          `Dispatching transaction with ${updatedCount} images updates`,
        );
        editor.view.dispatch(transaction);

        // Wait for browser to render
        await new Promise((resolve) => {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              resolve(undefined);
            });
          });
        });
      }

      imageQueue.current = [];
    } catch (error) {
      console.error("Error uploading images:", error);
      throw error;
    }
  }, [editor, sendRequest]);

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
    onImageUploadFromURL: handleImageUploadFromURL,
    onSetImageSize: setImageSize,
    uploadAllImages,
  };
};
