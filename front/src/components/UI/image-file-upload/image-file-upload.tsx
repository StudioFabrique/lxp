import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { validateImageFile } from "../../../utils/validate-image-file";
import EditIcon from "../svg-icons/edit-icon";

const ImageFileUpload: FC<{
  maxSize: number;
  onSetFile: (file: File) => void;
  type?: number;
}> = ({ maxSize, onSetFile, type = 1 }) => {
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
        console.log("selected");
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

  return type === 1 ? (
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
  ) : (
    <div className="flex flex-col gap-y-2">
      <p>Téléverser une image de groupe</p>
      <span className="flex w-full">
        <p
          onClick={handleSetFile}
          className="cursor-pointer  bg-secondary-focus text-center p-2 text-sm rounded-l-lg"
        >
          Choisir un fichier
        </p>
        <p className=" text-center p-2 text-sm bg-secondary-content rounded-r-lg">
          {file?.name}
        </p>
      </span>
      <input
        ref={fileRef}
        type="file"
        accept=".jpg, ;jpeg, .png, .webp, .gif"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ImageFileUpload;
