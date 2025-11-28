import React, { ChangeEvent, FC, useRef, useState } from "react";
import toast from "react-hot-toast";
import { maxSizeError } from "../../../helpers/max-size-error";
import { Edit, Upload } from "lucide-react";

const allowedExtensions = /(\.jpeg|\.jpg|\.png|\.gif|\.webp)$/i;

const ImageFileUpload: FC<{
  maxSize: number;
  label: string;
  variant?: "normal" | "minimized";
  onSetFile: (file: File) => void;
}> = ({ maxSize, onSetFile, label, variant = "normal" }) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFile = event.target.files[0];
      if (selectedFile && selectedFile !== undefined) {
        if (!selectedFile.type.startsWith("image/")) {
          toast.error("Ce fichier n'est pas un fichier image");
          return;
        }
        if (!allowedExtensions.test(selectedFile.name)) {
          toast.error("Extension de fichier non autorisée");
          return;
        }
        if (selectedFile.size > maxSize) {
          toast.error(maxSizeError(maxSize));
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
    <div
      className={`w-full flex ${
        variant === "normal" ? "flex-col" : "flex-row"
      } gap-y-2 justify-center`}
    >
      {label.length > 0 ? <p>{label}</p> : null}
      <span className="flex w-full items-center justify-end">
        <div
          onClick={handleSetFile}
          className={`gap-2 px-5 flex ${
            variant === "normal" ? "justify-center" : "justify-between"
          } items-center cursor-pointer bg-primary text-base-100 text-center text-xs lg:text-sm p-2 rounded-l-lg ${
            variant === "normal" && "w-[50%]"
          } h-10 last:rounded-r-lg`}
        >
          {variant === "minimized" &&
            (!fileName ? <Upload className="w-5" /> : <Edit className="w-5" />)}
          <span>
            {variant === "normal" || !fileName
              ? "Choisir un fichier"
              : fileName}
          </span>
        </div>
        {variant === "normal" && (
          <p className="text-center my-auto p-2 text-xs lg:text-sm bg-secondary/50 rounded-r-lg w-full overflow-x-clip h-10">
            {fileName ?? "Aucun fichier choisi"}
          </p>
        )}
      </span>
      <input
        ref={fileRef}
        type="file"
        accept=".jpg, ;jpeg, .png, .webp, .gif"
        className="hidden"
        onChange={handleFileChange}
        name="file"
        aria-label="téléverser une image"
        id="file"
      />
    </div>
  );
};

const MemoizedImageFileUpload = React.memo(ImageFileUpload);

export default MemoizedImageFileUpload;
