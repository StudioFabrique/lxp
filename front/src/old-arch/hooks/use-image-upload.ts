import toast from "react-hot-toast";
import { maxSizeError } from "../helpers/max-size-error";
import { ChangeEvent, useRef, useState } from "react";

const allowedExtensions = /(\.jpeg|\.jpg|\.png|\.gif|\.webp)$/i;

const useImageUpload = (maxSize: number, onSetFile: (file: File) => void) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [image, setImage] = useState<string | null>(null);

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
        const reader = new FileReader();
        reader.onloadend = () => {
          const imageString = reader.result as string;
          setImage(imageString);
        };
        reader.readAsDataURL(selectedFile);
      }
    } else resetFile();
  };

  const handleSetFile = () => {
    if (fileRef && fileRef.current) {
      fileRef.current.value = "";
      fileRef.current?.click();
    }
  };

  const resetFile = () => {
    if (fileRef && fileRef.current) {
      fileRef.current.value = "";
      fileRef.current?.click();
      setImage(null);
    }
  };
  return {
    image,
    fileName,
    handleFileChange,
    handleSetFile,
  };
};

export default useImageUpload;
