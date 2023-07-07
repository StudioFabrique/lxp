import { ChangeEvent, FC, useEffect, useState } from "react";
import { validateImageFile } from "../../../utils/validate-image-file";

const ImageFileUpload: FC<{
  maxSize: number;
  onSetFile: (file: File) => void;
}> = ({ maxSize, onSetFile }) => {
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (file) {
      onSetFile(file);
    }
  }, [file, onSetFile]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFile = event.target.files[0];
      if (selectedFile) {
        if (validateImageFile(selectedFile, maxSize)) {
          setFile(selectedFile);
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
