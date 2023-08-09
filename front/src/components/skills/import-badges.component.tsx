import { useEffect, useRef, useState } from "react";
import { validateImageFile } from "../../utils/validate-image-file";
import { useDispatch } from "react-redux";

import { parcoursSkillsAction } from "../../store/redux-toolkit/parcours/parcours-skills";
import UploadIcon from "../UI/svg-icons/upload-icon.component";
import { compressImage } from "../../helpers/compress-image";

const maxSize = 100 * 1024;

const ImportBadges = () => {
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
      dispatch(
        parcoursSkillsAction.addBadge({
          image: selectedFiles,
        })
      );
      setSelectedFiles(null);
    }
  }, [selectedFiles, dispatch]);

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
