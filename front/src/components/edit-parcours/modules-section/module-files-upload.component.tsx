import { ChangeEvent } from "react";
import { validateImageFile } from "../../../utils/validate-image-file";

interface ModuleUploadFileProps {
  setImage: (file: File) => void;
}

const maxSize = 1024 * 1024;

const ModuleFilesUpload = (props: ModuleUploadFileProps) => {
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFile = event.target.files[0];
      if (selectedFile && selectedFile !== undefined) {
        if (validateImageFile(selectedFile, maxSize)) {
          props.setImage(selectedFile);
        }
      } else {
        console.log("Fichier non autorisé pour une raison ou une autre.");
      }
    }
  };

  return (
    <input
      className="file-input file-input-primary border-none focus:outline-none w-full"
      type="file"
      id="image"
      name="image"
      accept=".jpg, ;jpeg, .png, .webp, .gif"
      onChange={handleFileChange}
    />
  );
};

export default ModuleFilesUpload;
