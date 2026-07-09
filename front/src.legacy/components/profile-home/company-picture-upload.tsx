import toast from "react-hot-toast";
import useHttp from "../../hooks/use-http";
import ProfileImageFileUpload from "../UI/image-file-upload/profile-image-file-upload";
import { useCallback, useEffect, useState } from "react";
import { avatarImageMaxSize } from "../../config/images-sizes";
import FadeWrapper from "../UI/fade-wrapper/fade-wrapper";
import ColorPicker from "../UI/color-picker";
import { COMPANY_LOGO } from "../../../src/config/urls";

const CompanyPictureUpload = () => {
  const { sendRequest } = useHttp(true);
  const [temporaryAvatar, setTemporaryAvatar] = useState<{
    file: File | null;
    url: string | null;
  }>({ file: null, url: COMPANY_LOGO });

  const [bgColor, setBgColor] = useState<string>("#FFFFFF");

  const handleSubmitPicture = useCallback(
    (avatar: { file: File | null; url: string | null }) => {
      const applyData = ({ message }: { message: string }) => {
        toast.success(message);
      };

      const formData = new FormData();
      if (avatar.file) formData.append("image", avatar.file);
      if (bgColor) formData.append("color", bgColor);

      sendRequest(
        {
          path: `/company-logo`,
          method: "post",
          body: formData,
        },
        applyData
      );
    },
    [sendRequest, bgColor]
  );

  useEffect(() => {
    if (temporaryAvatar.file) {
      handleSubmitPicture(temporaryAvatar);
    }
  }, [temporaryAvatar, handleSubmitPicture]);

  return (
    <div className="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
      <div className="card-body p-6">
        {/* Header */}
        <h2 className="card-title text-lg font-medium mb-4">
          Logo de l'organisme
        </h2>

        {/* Main */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left color picker */}
          <div className="flex flex-col gap-3 items-center md:items-start w-full md:w-auto">
            <span className="label-text font-semibold">Arrière-plan</span>
            <ColorPicker onColorChange={setBgColor} />
            {!temporaryAvatar.file && (
              <p className="text-xs text-base-content/60 italic">
                Formats : .jpg, .jpeg, .png
              </p>
            )}
          </div>

          {/* Right image upload */}
          <div className="flex-shrink-0">
            <ProfileImageFileUpload
              temporaryAvatar={temporaryAvatar}
              onSetTemporaryAvatar={setTemporaryAvatar}
              maxSize={avatarImageMaxSize}
            >
              Ajouter le Logo
            </ProfileImageFileUpload>
          </div>
        </div>

        {/* Feedback */}
        {temporaryAvatar.file && (
          <FadeWrapper>
            <div className="alert alert-success mt-6 py-2 shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="text-sm">
                <span>Rechargement requis pour afficher le nouveau logo</span>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="btn btn-sm btn-ghost"
              >
                Recharger
              </button>
            </div>
          </FadeWrapper>
        )}
      </div>
    </div>
  );
};

export default CompanyPictureUpload;
