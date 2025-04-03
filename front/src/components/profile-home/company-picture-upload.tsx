import toast from "react-hot-toast";
import useHttp from "../../hooks/use-http";
import ProfileImageFileUpload from "../UI/image-file-upload/profile-image-file-upload";
import { useCallback, useEffect, useState } from "react";
import { avatarImageMaxSize } from "../../config/images-sizes";

const CompanyPictureUpload = () => {
  const { sendRequest } = useHttp(true);
  const [temporaryAvatar, setTemporaryAvatar] = useState<{
    file: File | null;
    url: string | null;
  }>({ file: null, url: null });

  const handleSubmitPicture = useCallback(
    (avatar: { file: File | null; url: string | null }) => {
      const applyData = ({ message }: { message: string }) => {
        toast.success(message);
      };

      const formData = new FormData();
      if (avatar.file) formData.append("image", avatar.file);

      sendRequest(
        {
          path: `/company-logo`,
          method: "post",
          body: formData,
        },
        applyData,
      );
    },
    [sendRequest],
  );

  useEffect(() => {
    if (temporaryAvatar.file) {
      handleSubmitPicture(temporaryAvatar);
    }
  }, [temporaryAvatar, handleSubmitPicture]);

  return (
    <div className="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="card-body flex flex-col gap-4 p-6 rounded-lg">
        <p className="text-base-content text-lg font-medium">
          Téléverser un nouveau logo de l'organisme de formation
        </p>
        <ProfileImageFileUpload
          temporaryAvatar={temporaryAvatar}
          onSetTemporaryAvatar={setTemporaryAvatar}
          maxSize={avatarImageMaxSize}
        />
        <p className="ml-2 text-sm text-gray-600">
          Formats acceptés : .jpg, .jpeg, .png
        </p>
      </div>
    </div>
  );
};

export default CompanyPictureUpload;
