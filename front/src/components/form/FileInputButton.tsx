import { useId } from "react";
import { Paperclip } from "lucide-react";

type FileInputButtonProps = {
  label: string;
  buttonLabel?: string;
  multiple?: boolean;
  accept?: string;
  onFiles: (files: File[]) => void;
};

/**
 * Sélecteur de fichiers au libellé en français : le champ natif affiche « Choose
 * Files / No file chosen » selon la langue du navigateur. Le champ reste dans la
 * page (masqué visuellement) pour conserver le focus clavier.
 */
const FileInputButton = ({
  label,
  buttonLabel = "Ajouter des fichiers",
  multiple = true,
  accept,
  onFiles,
}: FileInputButtonProps) => {
  const inputId = useId();

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={inputId} className="text-sm font-semibold">
        {label}
      </label>
      <input
        id={inputId}
        type="file"
        className="peer sr-only"
        multiple={multiple}
        accept={accept}
        onChange={(event) => {
          onFiles(Array.from(event.target.files ?? []));
          // Permet de choisir de nouveau le même fichier après l'avoir retiré.
          event.target.value = "";
        }}
      />
      <label
        htmlFor={inputId}
        className="btn btn-outline btn-sm w-fit cursor-pointer peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary"
      >
        <Paperclip className="h-4 w-4" aria-hidden="true" />
        {buttonLabel}
      </label>
    </div>
  );
};

export default FileInputButton;
