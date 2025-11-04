import { ChangeEvent } from "react";

type Props = {
  isDisabled?: boolean;
  onSetFile: (event: ChangeEvent<HTMLInputElement>) => void;
};

/**
 * Component pour téléverser une image pour un module
 *
 * @param {Props} props
 * @prop {function} onSetFile - fonction à appeler lorsque l'utilisateur a choisi un fichier
 */

export default function FormUploadImage({
  isDisabled = false,
  onSetFile,
}: Props) {
  return (
    <input
      type="file"
      className="file-input file-input-primary w-full"
      accept=".jpg, ;jpeg, .png, .webp, .gif"
      onChange={onSetFile}
      name="file"
      aria-label="téléverser une image"
      id="file"
      disabled={isDisabled}
    />
  );
}
