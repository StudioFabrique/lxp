import React, { ChangeEvent, FC } from "react";

const ImageFileUpload: FC<{
  maxSize: number;
  onSetFile: (file: File) => void;
}> = ({ maxSize, onSetFile }) => {
  const validateImageFile = (file: File) => {
    const allowedExtensions = /(\.jpeg|\.jpg|\.png|\.gif|\.webp)$/i;
    const maxSizeInBytes = maxSize; // 2 Mo

    if (!allowedExtensions.test(file.name)) {
      return false; // Extension de fichier non autorisée
    }

    if (file.size > maxSizeInBytes) {
      return false; // Fichier trop volumineux
    }

    return true; // Fichier valide
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFile = event.target.files[0];
      if (selectedFile) {
        if (validateImageFile(selectedFile)) {
          onSetFile(selectedFile);
        }
      } else {
        console.log("Fichier non autorisé pour une raison ou une autre.");
      }
    }
  };

  return (
    <span className="flex flex-col gap-y-2">
      <label htmlFor="fileToUpload">Téléverser une image</label>
      <input
        type="file"
        className="file-input file-input-sm file-font-normal file-input-primary w-full rounded-lg"
        onChange={handleFileChange}
      />
    </span>
  );
};

export default ImageFileUpload;
