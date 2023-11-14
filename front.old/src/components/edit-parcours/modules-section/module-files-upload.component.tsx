import React, { ChangeEvent, useRef } from "react";
import toast from "react-hot-toast";

interface ModuleUploadFileProps {
  setImage: (file: File) => void;
}

const maxSize = 1024 * 1024;

const ModuleFilesUpload = (props: ModuleUploadFileProps) => {
  const imageRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFile = event.target.files[0];
      if (selectedFile && selectedFile !== undefined) {
        if (!selectedFile.type.startsWith("image/")) {
          toast.error("Ce fichier n'est pass un fichier image");
          resetFileSelection();
          return;
        }
        if (selectedFile.size > maxSize) {
          toast.error(
            `La taille du fichier doit être inférieure à ${
              maxSize / (1024 * 1024)
            } mo`
          );
          resetFileSelection();
          return;
        }
        props.setImage(selectedFile);
        resetFileSelection();
      } else {
        console.log("Fichier non autorisé pour une raison ou une autre.");
      }
    }
    resetFileSelection();
  };

  const resetFileSelection = () => {
    if (imageRef && imageRef.current) {
      imageRef.current.value = "";
    }
  };

  return (
    <input
      className="file-input file-input-primary border-none focus:outline-none w-full"
      ref={imageRef}
      type="file"
      id="image"
      name="image"
      accept=".jpg, ;jpeg, .png, .webp, .gif"
      onChange={handleFileChange}
    />
  );
};

const MemoizedModuleFilesUpload = React.memo(ModuleFilesUpload);

export default MemoizedModuleFilesUpload;
