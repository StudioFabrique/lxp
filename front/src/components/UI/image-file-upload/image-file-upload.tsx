import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { validateImageFile } from "../../../utils/validate-image-file";
import EditIcon from "../svg-icons/edit-icon";

const ImageFileUpload: FC<{
  maxSize: number;
  onSetFile: (file: File) => void;
}> = ({ maxSize, onSetFile }) => {
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

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

  const handleSetFile = () => {
    if (fileRef) {
      fileRef.current?.click();
    }
  };

  return (
    <span className="flex gap-x-2 cursor-pointer">
      <p onClick={handleSetFile}>Changer l'image</p>
      <input
        ref={fileRef}
        type="file"
        accept=".jpg, ;jpeg, .png, .webp, .gif"
        className="hidden file-input file-input-sm file-font-normal file-input-primary w-full rounded-lg"
        onChange={handleFileChange}
      />
      <EditIcon />
    </span>
  );
};

export default ImageFileUpload;
