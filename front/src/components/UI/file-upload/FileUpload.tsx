import { FileCheck2, Loader2, Pencil, Upload } from "lucide-react";
import { ReactNode, useId, useRef, useState } from "react";
import toast from "react-hot-toast";
import { maxSizeError } from "../../../utils/helpers/max-size-error";
import { cn } from "../../../utils/cn";

export type UploadFileType =
  | "image"
  | "png"
  | "badge"
  | "csv"
  | "zip"
  | "mbz"
  | "video"
  | "document"
  | "any";

const fileTypes: Record<
  UploadFileType,
  { accept: string; extensions?: RegExp; mimePrefix?: string }
> = {
  image: {
    accept: ".jpg,.jpeg,.png,.webp,.gif",
    extensions: /\.(jpe?g|png|webp|gif)$/i,
    mimePrefix: "image/",
  },
  png: {
    accept: ".png",
    extensions: /\.png$/i,
    mimePrefix: "image/png",
  },
  badge: {
    accept: ".png,.jpg,.jpeg,.svg",
    extensions: /\.(png|jpe?g|svg)$/i,
    mimePrefix: "image/",
  },
  csv: {
    accept: ".csv,text/csv",
    extensions: /\.csv$/i,
  },
  zip: {
    accept: ".zip,application/zip",
    extensions: /\.zip$/i,
  },
  mbz: {
    accept: ".mbz",
    extensions: /\.mbz$/i,
  },
  video: {
    accept: "video/*",
    mimePrefix: "video/",
  },
  document: {
    accept: ".pdf,.ppt,.pptx,.txt,.doc,.docx,.xls,.xlsx,.md",
    extensions: /\.(pdf|pptx?|txt|docx?|xlsx?|md)$/i,
  },
  any: { accept: "*/*" },
};

type Props = {
  onFileSelect: (file: File) => void;
  fileType?: UploadFileType;
  maxSize?: number;
  label?: string;
  buttonLabel?: string;
  helperText?: string;
  disabled?: boolean;
  isLoading?: boolean;
  compact?: boolean;
  preserveButtonLabel?: boolean;
  ghost?: boolean;
  icon?: ReactNode;
  error?: string | null;
  className?: string;
};

export default function FileUpload({
  onFileSelect,
  fileType = "any",
  maxSize,
  label,
  buttonLabel = "Choisir un fichier",
  helperText,
  disabled = false,
  isLoading = false,
  compact = false,
  preserveButtonLabel = false,
  ghost = false,
  icon,
  error,
  className = "",
}: Props) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const definition = fileTypes[fileType];

  const selectFile = (file: File) => {
    const extensionIsValid =
      !definition.extensions || definition.extensions.test(file.name);
    const mimeIsValid =
      !definition.mimePrefix || file.type.startsWith(definition.mimePrefix);

    if (!extensionIsValid || !mimeIsValid) {
      toast.error("Extension de fichier non autorisée");
      return;
    }
    if (maxSize && file.size > maxSize) {
      toast.error(maxSizeError(maxSize));
      return;
    }

    setFileName(file.name);
    onFileSelect(file);
  };

  return (
    <div className={`${compact ? "w-auto" : "w-full"} ${className}`}>
      {label && (
        <label htmlFor={id} className="mb-2 block text-sm font-semibold">
          {label}
        </label>
      )}
      <div className="flex w-full items-stretch">
        <button
          type="button"
          disabled={disabled || isLoading}
          onClick={() => {
            if (inputRef.current) inputRef.current.value = "";
            inputRef.current?.click();
          }}
          className={cn(
            "btn btn-sm btn-secondary gap-2 px-5",
            compact ? "" : "shrink-0 rounded-r-none",
            ghost
              ? "btn-ghost text-white hover:underline hover:bg-transparent hover:border-transparent"
              : "",
            error ? "btn-error" : "",
          )}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : fileName && !preserveButtonLabel ? (
            compact ? (
              <Pencil className="h-4 w-4" />
            ) : (
              <FileCheck2 className="h-4 w-4" />
            )
          ) : (
            (icon ?? <Upload className="h-4 w-4" />)
          )}
          <span className="max-w-64 truncate">
            {compact && fileName && !preserveButtonLabel
              ? fileName
              : buttonLabel}
          </span>
        </button>
        {!compact && (
          <span className="flex h-8 min-w-0 flex-1 items-center rounded-r-lg bg-secondary/50 px-4 text-xs lg:text-sm">
            <span className="truncate">
              {fileName ?? "Aucun fichier choisi"}
            </span>
          </span>
        )}
      </div>
      {(error || helperText) && (
        <p
          className={`mt-2 text-xs ${
            error ? "text-error" : "text-base-content/60"
          }`}
        >
          {error ?? helperText}
        </p>
      )}
      <input
        ref={inputRef}
        id={id}
        type="file"
        className="sr-only"
        accept={definition.accept}
        disabled={disabled || isLoading}
        onChange={(event) => {
          const file = event.currentTarget.files?.[0];
          if (file) selectFile(file);
        }}
      />
    </div>
  );
}
