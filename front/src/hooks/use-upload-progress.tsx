import { useState } from "react";

export const useUploadProgress = () => {
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const createUploadStream = (xhr: XMLHttpRequest) => {
    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(progress);
      }
    });
  };

  return {
    uploadProgress,
    setUploadProgress,
    createUploadStream,
  };
};
