import { useEffect, useRef, useState } from "react";
import { validateImageFile } from "../../utils/validate-image-file";
import { useDispatch } from "react-redux";

import { parcoursSkillsAction } from "../../store/redux-toolkit/parcours/parcours-skills";
import UploadIcon from "../UI/svg-icons/upload-icon.component";

const maxSize = 100 * 1024;

const ImportBadges = () => {
  const fileSelectRef = useRef<any>(null);
  const [selectedFiles, setSelectedFiles] = useState<string | null>(null);
  const dispatch = useDispatch();

  const handleLabelClick = () => {
    fileSelectRef.current.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files) {
      if (validateImageFile(files[0], maxSize)) {
        setSelectedFiles(URL.createObjectURL(files[0]));
      }
    } else {
      setSelectedFiles(null);
    }
  };

  useEffect(() => {
    if (selectedFiles) {
      dispatch(
        parcoursSkillsAction.importBadges({
          image: selectedFiles,
          isSelected: false,
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
