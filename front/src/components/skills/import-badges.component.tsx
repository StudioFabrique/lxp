import { FC, useEffect, useRef, useState } from "react";

type Props = {
  label: string;
  outline?: boolean;
  onClickEvent?: () => void;
};

const ImportBadges: FC<Props> = ({ label, outline = true, onClickEvent }) => {
  const fileSelectRef = useRef<any>(null);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  let buttonStyle = "w-fit flex gapx-x-1 items-center";
  let iconStyle = "w-4 h-4";

  const setButtonStyle = () => {
    return outline ? buttonStyle : buttonStyle + " btn btn-primary btn-sm";
  };

  const setIconStyle = () => {
    return !outline ? iconStyle : iconStyle + " text-primary";
  };

  const handleLabelClick = () => {
    fileSelectRef.current.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    console.log({ files });

    if (files && files.length > 0) {
      setSelectedFiles(files);
      // Effectuez les actions supplémentaires que vous souhaitez avec les fichiers sélectionnés
    } else {
      setSelectedFiles(null);
      console.log("Veuillez sélectionner au moins un fichier.");
    }
  };

  useEffect(() => {
    if (selectedFiles && selectedFiles.length > 0) {
      console.log({ selectedFiles });
    }
  }, [selectedFiles]);

  return (
    <>
      <button className={setButtonStyle()} onClick={handleLabelClick}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={setIconStyle()}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
          />
        </svg>
        <p className={outline ? "text-primary" : ""}>{label}</p>
      </button>
      <input
        className="hidden"
        name="badges-select"
        type="file"
        ref={fileSelectRef}
        accept=".png"
        multiple
        onChange={handleFileChange}
      />
    </>
  );
};

export default ImportBadges;