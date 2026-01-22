import React, { ChangeEvent, FC, useRef, useState } from "react";
import toast from "react-hot-toast";
import { maxSizeError } from "../../../helpers/max-size-error";
import { Edit, Upload } from "lucide-react";

const allowedExtensions = {
  image: {
    rgx: /(\.jpeg|\.jpg|\.png)$/i,
    type: ["image/png", "image/jpeg", "image/jpg"],
    pickerAccept: ".jpg, .jpeg, .png",
  },
  zip: {
    rgx: /(\.zip)$/i,
    type: "application/x-zip-compressed",
    pickerAccept: ".zip",
  },
};

const FileUpload: FC<{
  maxSize: number;
  label?: string;
  buttonLabel?: string;
  fileType?: "image" | "zip";
  variant?: "normal" | "minimized";
  onSetFile: (file: File) => void;
}> = ({
  maxSize,
  onSetFile,
  label,
  buttonLabel,
  variant = "normal",
  fileType = "image",
}) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFile = event.target.files[0];
      if (selectedFile && selectedFile !== undefined) {
        if (
          !allowedExtensions[fileType].rgx.test(selectedFile.name) &&
          !allowedExtensions[fileType].type.includes(selectedFile.type)
        ) {
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
      {label?.length ? <p>{label}</p> : null}
      <span className="flex w-full items-center justify-end">
        <button
          onClick={handleSetFile}
          className={`btn btn-sm gap-2 px-5 flex ${
            variant === "normal" ? "justify-center" : "justify-between"
          } items-center cursor-pointer btn-primary btn-soft text-center p-2 rounded-l-sm last:rounded-r-sm`}
        >
          {variant === "minimized" &&
            (!fileName ? <Upload className="w-4" /> : <Edit className="w-5" />)}
          <span>
            {variant === "normal" || !fileName
              ? buttonLabel
                ? buttonLabel
                : "Choisir un fichier"
              : fileName}
          </span>
        </button>
        {variant === "normal" && (
          <p className="text-center my-auto p-2 text-xs lg:text-sm bg-secondary/50 rounded-r-lg w-full overflow-x-clip h-10">
            {fileName ?? "Aucun fichier choisi"}
          </p>
        )}
      </span>
      <input
        ref={fileRef}
        type="file"
        accept={allowedExtensions[fileType].pickerAccept}
        className="hidden"
        onChange={handleFileChange}
        name="file"
        aria-label="téléverser un fichier"
        id="file"
      />
    </div>
  );
};

const MemoizedFileUpload = React.memo(FileUpload);

export default MemoizedFileUpload;
