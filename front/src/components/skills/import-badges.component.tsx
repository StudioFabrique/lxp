import { useEffect, useRef, useState } from "react";
import { validateImageFile } from "../../utils/validate-image-file";
import { useDispatch } from "react-redux";

import { parcoursSkillsAction } from "../../store/redux-toolkit/parcours/parcours-skills";

/**
 * input de type file pour importer des images pour des badges
 *
 */

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
        className="w-[75px] h-[75px] flex justify-center items-center border border-primary p-2 rounded-xl"
        onClick={handleLabelClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-full h-full text-primary"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
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
