import React, { ChangeEvent, FC, useRef, useState } from "react";
import toast from "react-hot-toast";

const allowedExtensions = /(\.jpeg|\.jpg|\.png|\.gif|\.webp)$/i;

const ImageFileUpload: FC<{
  maxSize: number;
  label: string;
  onSetFile: (file: File) => void;
}> = ({ maxSize, onSetFile, label }) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFile = event.target.files[0];
      if (selectedFile && selectedFile !== undefined) {
        if (!selectedFile.type.startsWith("image/")) {
          toast.error("Ce fichier n'est pass un fichier image");
          return;
        }
        if (!allowedExtensions.test(selectedFile.name)) {
          toast.error("Extension de fichier non autorisée");
          return;
        }
        if (selectedFile.size > maxSize) {
          toast.error(
            `La taille du fichier doit être inférieure à ${
              maxSize / (1024 * 1024)
            } mo`
          );
          return;
        }
        setFileName(selectedFile.name);
        onSetFile(selectedFile);
      } else {
        console.log("Fichier non autorisé pour une raison ou une autre.");
      }
    }
  };

  const handleSetFile = () => {
    if (fileRef && fileRef.current) {
      fileRef.current.value = "";
      fileRef.current?.click();
    }
  };

  return (
    <div className="w-full flex flex-col gap-y-2">
      <p>{label}</p>
      <span className="flex w-full items-center">
        <p
          onClick={handleSetFile}
          className="flex justify-center items-center cursor-pointer bg-primary font-bold text-neutral text-center text-xs lg:text-sm p-2 rounded-l-lg w-[50%] h-10"
        >
          Choisir un fichier
        </p>
        <p className="text-center my-auto p-2 text-xs  lg:text-sm bg-primary-content rounded-r-lg w-full overflow-x-clip h-10">
          {fileName ?? "Aucun fichier choisi"}
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

const MemoizedImageFileUpload = React.memo(ImageFileUpload);

export default MemoizedImageFileUpload;
