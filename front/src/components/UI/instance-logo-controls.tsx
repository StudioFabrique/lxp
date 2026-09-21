import { Trash2 } from "lucide-react";
import { avatarImageMaxSize } from "../../config/images-sizes";
import ColorPicker from "./color-picker";
import ImageFileUpload, {
  type TemporaryImage,
} from "./image-file-upload/image-file-upload";

type Props = {
  temporaryImage: TemporaryImage;
  onSetTemporaryImage: (image: TemporaryImage) => void;
  backgroundColor: string;
  onBackgroundColorChange: (color: string) => void;
  onPreviewAvailabilityChange?: (available: boolean) => void;
  onRemove?: () => void;
  optional?: boolean;
  helpText: string;
};

export default function InstanceLogoControls({
  temporaryImage,
  onSetTemporaryImage,
  backgroundColor,
  onBackgroundColorChange,
  onPreviewAvailabilityChange,
  onRemove,
  optional = false,
  helpText,
}: Props) {
  return (
    <div className="w-full min-w-0 max-w-sm text-center">
      <div className="mb-2 text-center">
        <span className="text-sm font-bold text-base-content">
          Logo{" "}
          {optional && (
            <span className="font-normal text-base-content/50">
              (facultatif)
            </span>
          )}
        </span>
      </div>

      <div className="flex items-end justify-center gap-2">
        <div className="relative w-full min-w-0 max-w-72">
          <ImageFileUpload
            temporaryImage={temporaryImage}
            onSetTemporaryImage={onSetTemporaryImage}
            maxSize={avatarImageMaxSize}
            variant="logo"
            compact
            previewBackgroundColor={backgroundColor}
            onPreviewAvailabilityChange={onPreviewAvailabilityChange}
          >
            Ajouter un logo
          </ImageFileUpload>
          <div className="absolute right-2 top-2 z-10">
            <ColorPicker
              compact
              defaultColor={backgroundColor}
              onColorChange={onBackgroundColorChange}
            />
          </div>
        </div>
        {onRemove && (
          <button
            type="button"
            className="btn btn-ghost btn-sm btn-square shrink-0 text-error"
            onClick={onRemove}
            aria-label="Supprimer le logo"
            title="Supprimer le logo"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>

      <p className="mt-2 text-center text-xs text-base-content/60">
        {helpText}
      </p>
    </div>
  );
}
