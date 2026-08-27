import toast from "react-hot-toast";
import { maxSizeError } from "../../../utils/helpers/max-size-error";
import {
  ChangeEvent,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from "react";
import { EditIcon, Upload } from "lucide-react";
import { AvatarSmall } from "../../avatar/AvatarSmall";
import AppImage from "../image/app-image";

export type TemporaryImage = { file: File | null; url: string | null };

type ImageFileUploadProps = {
  temporaryImage: TemporaryImage;
  onSetTemporaryImage: (image: TemporaryImage) => void;
  maxSize: number;
  existingImage?: string;
  variant?: "avatar" | "logo" | "image";
  previewBackgroundColor?: string;
  onPreviewAvailabilityChange?: (isAvailable: boolean) => void;
};

const avatarAllowedExtensions = /(\.jpeg|\.jpg|\.png|\.gif|\.webp)$/i;
const logoAllowedExtensions = /(\.jpeg|\.jpg|\.png)$/i;

const ImageFileUpload = ({
  temporaryImage,
  onSetTemporaryImage,
  maxSize,
  existingImage,
  variant = "avatar",
  previewBackgroundColor,
  onPreviewAvailabilityChange,
  children,
}: PropsWithChildren<ImageFileUploadProps>) => {
  const fileUploadRef = useRef<HTMLInputElement>(null);
  const [previewFailed, setPreviewFailed] = useState(false);
  const previewUrl = temporaryImage.url ?? existingImage ?? null;

  useEffect(() => {
    const url = temporaryImage.url;
    return () => {
      if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
    };
  }, [temporaryImage.url]);

  const onClickChangeImage = () => {
    fileUploadRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      toast.error("Ce fichier n'est pas un fichier image");
      return;
    }

    const allowedExtensions =
      variant === "logo" ? logoAllowedExtensions : avatarAllowedExtensions;
    if (!allowedExtensions.test(selectedFile.name)) {
      toast.error("Extension de fichier non autorisée");
      return;
    }

    if (selectedFile.size > maxSize) {
      toast.error(maxSizeError(maxSize));
      return;
    }

    const temporaryUrl = URL.createObjectURL(selectedFile);
    setPreviewFailed(false);
    onSetTemporaryImage({ file: selectedFile, url: temporaryUrl });
  };

  const isPreviewVariant = variant !== "avatar";

  return (
    <button
      type="button"
      onClick={onClickChangeImage}
      className={
        isPreviewVariant
          ? "group relative flex h-32 w-full min-w-0 max-w-72 items-center justify-center overflow-hidden rounded-xl border border-primary border-dashed p-3 shadow-sm transition hover:shadow-md"
          : "btn btn-ghost group relative h-fit w-fit rounded-full bg-white p-0 text-white"
      }
      style={
        isPreviewVariant && previewBackgroundColor
          ? { backgroundColor: previewBackgroundColor }
          : undefined
      }
      aria-label={isPreviewVariant ? "Modifier l'image" : "Modifier l'avatar"}
    >
      {isPreviewVariant ? (
        previewUrl && !previewFailed ? (
          <AppImage
            src={previewUrl}
            alt="Image"
            className="h-full w-full object-contain"
            onLoad={() => onPreviewAvailabilityChange?.(true)}
            onError={() => {
              setPreviewFailed(true);
              onPreviewAvailabilityChange?.(false);
            }}
          />
        ) : (
          <span className="flex items-center justify-center gap-2 px-4 text-center text-sm font-semibold text-base-content/70">
            <Upload className="h-5 w-5 shrink-0" aria-hidden="true" />
            {children ?? "Ajouter une image"}
          </span>
        )
      ) : temporaryImage.url || !children ? (
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
          isPreviewVariant ? "bg-black/15" : "rounded-full bg-white/20"
        }`}
      >
        <EditIcon
          className={`h-7 w-7 rounded-full bg-base-100/90 p-1.5 stroke-2 ${
            isPreviewVariant ? "text-base-content" : "text-black"
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

export default ImageFileUpload;
