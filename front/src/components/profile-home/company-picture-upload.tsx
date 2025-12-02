import toast from "react-hot-toast";
import useHttp from "../../hooks/use-http";
import ProfileImageFileUpload from "../UI/image-file-upload/profile-image-file-upload";
import { useCallback, useEffect, useState } from "react";
import { avatarImageMaxSize } from "../../config/images-sizes";
import FadeWrapper from "../UI/fade-wrapper/fade-wrapper";
import ColorPicker from "../UI/color-picker";
import { COMPANY_LOGO } from "../../config/urls";

const CompanyPictureUpload = () => {
  const { sendRequest } = useHttp(true);
  const [temporaryAvatar, setTemporaryAvatar] = useState<{
    file: File | null;
    url: string | null;
  }>({ file: null, url: COMPANY_LOGO });

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
        applyData
      );
    },
    [sendRequest]
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
        <span className="ml-2 flex flex-col gap-2">
          <div className="flex justify-center items-end gap-10">
            <ProfileImageFileUpload
              temporaryAvatar={temporaryAvatar}
              onSetTemporaryAvatar={setTemporaryAvatar}
              maxSize={avatarImageMaxSize}
            >
              Ajouter le Logo
            </ProfileImageFileUpload>
            <div className="flex flex-col gap-2">
              <ColorPicker onColorChange={() => {}} />
              {!temporaryAvatar.file && (
                <p className="text-sm text-gray-600">
                  Formats acceptés : .jpg, .jpeg, .png
                </p>
              )}
            </div>
          </div>
          {temporaryAvatar.file && (
            <FadeWrapper>
              <p className="text-success">
                Le nouveau logo sera affiché au prochain rechargement complet de
                la page
              </p>
              <button
                onClick={() => window.location.reload()}
                className="btn btn-ghost btn-sm mt-2"
              >
                Recharger la page
              </button>
            </FadeWrapper>
          )}
        </span>
      </div>
    </div>
  );
};

export default CompanyPictureUpload;
