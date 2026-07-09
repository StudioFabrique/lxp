import { CheckCircle, Loader2 } from "lucide-react";

type Props = {
  minUpload: number;
  maxUpload: number;
  uploadProgess: number;
  totalFiles: number;
};

const FileUploadStatus = ({ minUpload, maxUpload, uploadProgess }: Props) => {
  const calculateProgress = () => {
    if (uploadProgess <= minUpload) return 0;
    if (uploadProgess >= maxUpload) return 100;

    const range = maxUpload - minUpload;
    const currentProgress = uploadProgess - minUpload;
    return (currentProgress / range) * 100;
  };

  return (
    <div>
      {uploadProgess >= minUpload && uploadProgess <= maxUpload ? (
        <div
          className="radial-progress text-success"
          style={
            {
              "--value": calculateProgress(),
              "--size": "1.5rem",
              "--thickness": "3px",
            } as React.CSSProperties
          }
          role="progressbar"
        ></div>
      ) : uploadProgess >= maxUpload ? (
        <CheckCircle className="text-success" />
      ) : (
        <Loader2 className="animate-spin text-info" />
      )}
    </div>
  );
};

export default FileUploadStatus;
