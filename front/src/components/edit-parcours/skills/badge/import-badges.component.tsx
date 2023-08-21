import { FC, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import Badge from "../../../../utils/interfaces/badge";
import { validateImageFile } from "../../../../utils/validate-image-file";
import { compressImage } from "../../../../helpers/compress-image";
import UploadIcon from "../../../UI/svg/upload-icon.component";

const maxSize = 1024 * 1024;

type Props = {
  onSubmit: (badge: Badge) => void;
};

const ImportBadges: FC<Props> = ({ onSubmit }) => {
  const fileSelectRef = useRef<any>(null);
  const [selectedFiles, setSelectedFiles] = useState<any>(null);
  const dispatch = useDispatch();

  const handleLabelClick = () => {
    fileSelectRef.current.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;

    if (files) {
      if (validateImageFile(files[0], maxSize)) {
        const file = await compressImage(files[0], 100);
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
    } else {
      setSelectedFiles(null);
    }
  };

  useEffect(() => {
    if (selectedFiles) {
      onSubmit({ image: selectedFiles });

      setSelectedFiles(null);
    }
  }, [selectedFiles, dispatch, onSubmit]);

  return (
    <>
      <div
        className="w-fit flex flex-col justify-center items-center border border-primary rounded-xl"
        onClick={handleLabelClick}
      >
        <button
          className="btn btn-sm btn-primary flex items-center"
          type="button"
        >
          <UploadIcon size={6} />
          <p>Importer un badge</p>
        </button>
      </div>
      <input
        className="hidden"
        name="badges-select"
        type="file"
        ref={fileSelectRef}
        accept=".png"
        onChange={handleFileChange}
      />
    </>
  );
};

export default ImportBadges;
