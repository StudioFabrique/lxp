import { ChangeEvent, FC, useRef } from "react";
import csvtojson from "csvtojson";

import ImportIcon from "../UI/svg-icons/import-icon.component";
import { Toaster, toast } from "react-hot-toast";

type Props = {
  label: string;
  outline?: boolean;
  onClickEvent: (csvData: Array<any>) => void;
};

const ImportButton: FC<Props> = ({ label, outline = true, onClickEvent }) => {
  const fileRef = useRef<any | null>(null); //  réference du sélecteur de fichier

  /**
   *  détecte l'action qui déclenche l'ouverture du séléecteur de fichier
   */
  const handleButtonClick = () => {
    if (fileRef.current) {
      fileRef.current.value = ""; // Réinitialise la valeur du champ de fichier
      if (fileRef.current.files) {
        fileRef.current.files = null; // Réinitialise la liste de fichiers sélectionnés
      }
      fileRef.current.click();
    }
  };

  /**
   * Gestion de la sélection du fichier, et lecture et parsing du fichier CSV, le tableau d'objets js est retourné au composant parent
   * @param event ChangeEvent<HTMLInputElement>
   */
  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const csvContent = e.target?.result as string;
        try {
          const csvData = await csvtojson().fromString(csvContent);
          console.log({ csvData });

          onClickEvent(csvData);
        } catch (error) {
          console.error(error);
          toast.error("Fichier tout moisi");
        }
      };
      reader.readAsText(file);
    }
  };

  let buttonStyle = "w-fit flex gap-x-1 items-center";

  /**
   * définit le style du bouton en fonction des props
   * @returns string
   */
  const setButtonStyle = () => {
    return outline ? buttonStyle : buttonStyle + " btn btn-primary";
  };

  return (
    <>
      <Toaster />
      <button className={setButtonStyle()} onClick={handleButtonClick}>
        <div className="text-primary">
          <ImportIcon size={4} />
        </div>
        <p className={outline ? "text-primary" : ""}>{label}</p>
      </button>
      <input
        className="hidden"
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        ref={fileRef}
      />
    </>
  );
};

export default ImportButton;
