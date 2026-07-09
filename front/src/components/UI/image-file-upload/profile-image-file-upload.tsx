import toast from "react-hot-toast";
import imageProfileReplacement from "../../../config/image-profile-replacement";
import { maxSizeError } from "../../../utils/helpers/max-size-error";
import {
  ChangeEvent,
  Dispatch,
  PropsWithChildren,
  Ref,
  SetStateAction,
  useRef,
} from "react";
import { EditIcon } from "lucide-react";

type ProfileImageFileUploadProps = {
  temporaryAvatar: { file: File | null; url: string | null };
  onSetTemporaryAvatar: Dispatch<
    SetStateAction<{ file: File | null; url: string | null }>
  >;
  maxSize: number;
  existingAvatar?: string;
};

const allowedExtensions = /(\.jpeg|\.jpg|\.png|\.gif|\.webp)$/i;

const ProfileImageFileUpload = ({
  temporaryAvatar,
  onSetTemporaryAvatar,
  maxSize,
  existingAvatar,
  children,
}: PropsWithChildren<ProfileImageFileUploadProps>) => {
  const fileUploadRef: Ref<HTMLInputElement> = useRef(null);

  const onClickChangeAvatar = () => {
    fileUploadRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFile = event.target.files[0];
      if (selectedFile && selectedFile !== undefined) {
        if (!selectedFile.type.startsWith("image/")) {
          toast.error("Ce fichier n'est pass un fichier image");
          return;
        }
        if (!allowedExtensions.test(selectedFile.name)) {
          toast.error("Extension de fichier non autorisée");
          return;
        }
        if (selectedFile.size > maxSize) {
          toast.error(maxSizeError(maxSize));
          return;
        }
        const temporaryUrl = URL.createObjectURL(selectedFile);
        onSetTemporaryAvatar({ file: selectedFile, url: temporaryUrl });
      } else {
        console.log("Fichier non autorisé pour une raison ou une autre.");
      }
    }
  };

  return (
    <button
      type="button"
      onClick={onClickChangeAvatar}
      className="btn btn-primary p-0 text-white rounded-full h-[60px] w-[60px] bg-white"
    >
      {temporaryAvatar.url || !children ? (
        <img
          className="h-[58px] w-[58px] rounded-full border-primary object-contain p-1"
          src={
            temporaryAvatar.url
              ? temporaryAvatar.url
              : `data:image/jpeg;base64,${
                  existingAvatar ?? imageProfileReplacement
                }`
          }
          alt="User Avatar"
        />
      ) : (
        children
      )}
      <span className="flex justify-end items-end p-1 absolute h-[56px] w-[56px] rounded-full backdrop-blur-[2px] opacity-0 hover:opacity-100">
        <EditIcon className="text-black stroke-[2px] p-1" />
      </span>
      <input
        ref={fileUploadRef}
        accept=".jpg, .jpeg, .png, .webp"
        className="hidden"
        type="file"
        onChange={handleFileChange}
      />
    </button>
  );
};

export default ProfileImageFileUpload;
