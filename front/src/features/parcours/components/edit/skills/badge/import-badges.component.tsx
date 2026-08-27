import { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { compressImage } from "../../../../../../utils/helpers/compress-image";

import Badge from "../../../../interfaces/badge";
import {
  validateImageDimensions,
  validateImageFile,
} from "../../../../helpers/validate-image-file";
import {
  badgeMaxDimensions,
  badgeMaxSize,
} from "../../../../../../config/images-sizes";
import FileUpload from "../../../../../../components/UI/file-upload/FileUpload";

const maxSize = badgeMaxSize;

type Props = {
  onSubmit: (badge: Badge) => void;
};

const ImportBadges: FC<Props> = ({ onSubmit }) => {
  const [selectedFiles, setSelectedFiles] = useState<any>(null);

  const handleFileChange = async (selectedFile: File) => {
    if (validateImageFile(selectedFile, maxSize)) {
      const hasValidDimensions = await validateImageDimensions(
        selectedFile,
        badgeMaxDimensions.width,
        badgeMaxDimensions.height,
      );
      if (!hasValidDimensions) {
        toast.error("Les dimensions du badge ne doivent pas dépasser 500 × 500 pixels.");
        return;
      }

      const file = selectedFile.name.toLowerCase().endsWith(".svg")
        ? selectedFile
        : await compressImage(selectedFile, badgeMaxDimensions.width);
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const imageString = reader.result as string;
          if (imageString) {
            setSelectedFiles(imageString);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  useEffect(() => {
    if (selectedFiles) {
      onSubmit({ image: selectedFiles });

      setSelectedFiles(null);
    }
  }, [selectedFiles, onSubmit]);

  return (
    <FileUpload
      compact
      fileType="badge"
      maxSize={maxSize}
      buttonLabel="Importer un badge"
      helperText="PNG, JPEG ou SVG — 500 Ko maximum — dimensions maximales : 500 × 500 px"
      onFileSelect={handleFileChange}
    />
  );
};

export default ImportBadges;
