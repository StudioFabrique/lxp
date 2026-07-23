import FileUpload from "./file-upload/FileUpload";

type Props = {
  isDisabled?: boolean;
  onSetFile: (file: File) => void;
};

export default function FormUploadImage({
  isDisabled = false,
  onSetFile,
}: Props) {
  return (
    <FileUpload
      fileType="image"
      buttonLabel="Sélectionner une image"
      helperText="JPG, PNG, WebP ou GIF"
      onFileSelect={onSetFile}
      disabled={isDisabled}
    />
  );
}
