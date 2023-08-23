import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { Toaster, toast } from "react-hot-toast";

import EditIcon from "../UI/svg/edit-icon";

const ImageFileUpload: FC<{
  maxSize: number;
  onSetFile: (file: File) => void;
}> = ({ maxSize, onSetFile }) => {
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (file) {
      onSetFile(file);
      setFile(null);
    }
  }, [file, onSetFile]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFile = event.target.files[0];
      if (selectedFile !== undefined) {
        if (!selectedFile.type.startsWith("image/")) {
          toast.error("Ce fichier n'est pass un fichier image");
          return;
        }
        if (selectedFile.size > maxSize) {
          toast.error("La taille du fichier doit être inférieure à 1mo");
          return;
        }
      }
      setFile(selectedFile);
    }
  };

  const handleSetFile = () => {
    if (fileRef) {
      fileRef.current?.click();
    }
  };

  return (
    <>
      <Toaster />
      <span className="flex gap-x-2 cursor-pointer">
        <p onClick={handleSetFile}>Changer l'image</p>
        <input
          ref={fileRef}
          name="image"
          id="image"
          type="file"
          accept=".jpg, ;jpeg, .png, .webp, .gif"
          className="hidden file-input file-input-sm file-font-normal file-input-primary w-full rounded-lg"
          onChange={handleFileChange}
        />
        <EditIcon />
      </span>
    </>
  );
};

export default ImageFileUpload;
