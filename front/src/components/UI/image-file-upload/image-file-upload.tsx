import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { validateImageFile } from "../../../utils/validate-image-file";
import EditIcon from "../svg/edit-icon";

const ImageFileUpload: FC<{
  maxSize: number;
  onSetFile: (file: File) => void;
  type?: 1 | 2;
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
      if (selectedFile && selectedFile !== undefined) {
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
      <span className="flex w-full items-center">
        <p
          onClick={handleSetFile}
          className="flex justify-center items-center cursor-pointer bg-secondary-focus text-center text-sm rounded-l-lg w-[50%] h-10"
        >
          Choisir un fichier
        </p>
        <p className="text-center p-2 text-sm bg-secondary-content rounded-r-lg w-full overflow-x-clip h-10">
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
