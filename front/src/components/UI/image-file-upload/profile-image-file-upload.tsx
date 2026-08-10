import toast from "react-hot-toast";
import { maxSizeError } from "../../../utils/helpers/max-size-error";
import {
  ChangeEvent,
  Dispatch,
  PropsWithChildren,
  Ref,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { EditIcon } from "lucide-react";
import { AvatarSmall } from "../../avatar/AvatarSmall";
import AppImage from "../image/app-image";

type ProfileImageFileUploadProps = {
  temporaryAvatar: { file: File | null; url: string | null };
  onSetTemporaryAvatar: Dispatch<
    SetStateAction<{ file: File | null; url: string | null }>
  >;
  maxSize: number;
  existingAvatar?: string;
  variant?: "avatar" | "logo";
  previewBackgroundColor?: string;
};

const avatarAllowedExtensions = /(\.jpeg|\.jpg|\.png|\.gif|\.webp)$/i;
const logoAllowedExtensions = /(\.jpeg|\.jpg|\.png)$/i;

const ProfileImageFileUpload = ({
  temporaryAvatar,
  onSetTemporaryAvatar,
  maxSize,
  existingAvatar,
  variant = "avatar",
  previewBackgroundColor,
  children,
}: PropsWithChildren<ProfileImageFileUploadProps>) => {
  const fileUploadRef: Ref<HTMLInputElement> = useRef(null);
  const [logoPreviewFailed, setLogoPreviewFailed] = useState(false);
  const previewUrl = temporaryAvatar.url ?? existingAvatar ?? null;

  useEffect(() => {
    const url = temporaryAvatar.url;
    return () => {
      if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
    };
  }, [temporaryAvatar.url]);

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
        const allowedExtensions =
          variant === "logo"
            ? logoAllowedExtensions
            : avatarAllowedExtensions;
        if (!allowedExtensions.test(selectedFile.name)) {
          toast.error("Extension de fichier non autorisée");
          return;
        }
        if (selectedFile.size > maxSize) {
          toast.error(maxSizeError(maxSize));
          return;
        }
        const temporaryUrl = URL.createObjectURL(selectedFile);
        setLogoPreviewFailed(false);
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
      className={
        variant === "logo"
          ? "group relative flex h-32 w-full min-w-0 max-w-72 items-center justify-center overflow-hidden rounded-xl border border-base-300 p-3 shadow-sm transition hover:border-primary hover:shadow-md"
          : "btn btn-ghost group relative h-fit w-fit rounded-full bg-white p-0 text-white"
      }
      style={
        variant === "logo"
          ? { backgroundColor: previewBackgroundColor }
          : undefined
      }
      aria-label={
        variant === "logo"
          ? "Modifier le logo de l’organisme"
          : "Modifier l’avatar"
      }
    >
      {variant === "logo" ? (
        previewUrl && !logoPreviewFailed ? (
          <AppImage
            src={previewUrl}
            alt="Logo de l’organisme"
            className="h-full w-full object-contain"
            onError={() => setLogoPreviewFailed(true)}
          />
        ) : (
          <span className="px-4 text-center text-sm font-semibold text-base-content/70">
            {children ?? "Ajouter un logo"}
          </span>
        )
      ) : temporaryAvatar.url || !children ? (
        <AvatarSmall
          user={{
            firstname: "a",
            lastname: "a",
            avatar: previewUrl ?? undefined,
          }}
          size={10}
        />
      ) : (
        children
      )}
      <span
        className={`pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 backdrop-blur-[1px] transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 ${
          variant === "logo" ? "bg-black/15" : "rounded-full bg-white/20"
        }`}
      >
        <EditIcon
          className={`h-7 w-7 rounded-full bg-base-100/90 p-1.5 stroke-2 ${
            variant === "logo" ? "text-base-content" : "text-black"
          }`}
        />
      </span>
      <input
        ref={fileUploadRef}
        accept={
          variant === "logo"
            ? ".jpg, .jpeg, .png"
            : ".jpg, .jpeg, .png, .gif, .webp"
        }
        className="hidden"
        type="file"
        onChange={handleFileChange}
      />
    </button>
  );
};

export default ProfileImageFileUpload;
