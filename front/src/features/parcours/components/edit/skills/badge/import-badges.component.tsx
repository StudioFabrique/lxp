import { FC, useEffect, useState } from "react";
import { compressImage } from "../../../../../../utils/helpers/compress-image";

import Badge from "../../../../interfaces/badge";
import { validateImageFile } from "../../../../helpers/validate-image-file";
import { badgeMaxSize } from "../../../../../../config/images-sizes";
import FileUpload from "../../../../../../components/UI/file-upload/FileUpload";

const maxSize = badgeMaxSize;

type Props = {
  onSubmit: (badge: Badge) => void;
};

const ImportBadges: FC<Props> = ({ onSubmit }) => {
  const [selectedFiles, setSelectedFiles] = useState<any>(null);

  const handleFileChange = async (selectedFile: File) => {
    if (validateImageFile(selectedFile, maxSize)) {
      const file = await compressImage(selectedFile, 100);
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
      fileType="png"
      maxSize={maxSize}
      buttonLabel="Importer un badge"
      onFileSelect={handleFileChange}
    />
  );
};

export default ImportBadges;
