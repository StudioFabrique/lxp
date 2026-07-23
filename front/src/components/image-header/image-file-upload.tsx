import { ImageUp } from "lucide-react";
import FileUpload from "../UI/file-upload/FileUpload";

type Props = {
  maxSize: number;
  onSetFile: (file: File) => void;
};

const ImageFileUpload = ({ maxSize, onSetFile }: Props) => (
  <div className="min-w-56 text-base-content">
    <FileUpload
      compact
      fileType="image"
      maxSize={maxSize}
      buttonLabel="Changer l'image"
      icon={<ImageUp className="h-5 w-5" />}
      onFileSelect={onSetFile}
    />
  </div>
);

export default ImageFileUpload;
