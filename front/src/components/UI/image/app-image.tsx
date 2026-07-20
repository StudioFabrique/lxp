import { ImgHTMLAttributes, useState } from "react";
import {
  ImageSource,
  normalizeImageSource,
} from "../../../utils/images/image-source";

type AppImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src: ImageSource;
  fallbackSrc?: ImageSource;
  mimeType?: string;
};

/** Image component shared by avatars, thumbnails and content illustrations. */
export default function AppImage({
  src,
  fallbackSrc,
  mimeType,
  onError,
  ...props
}: AppImageProps) {
  const [failedSource, setFailedSource] = useState<string>();
  const normalizedSource = normalizeImageSource(src, mimeType);
  const normalizedFallback = normalizeImageSource(fallbackSrc, mimeType);
  const displayedSource =
    normalizedSource && normalizedSource !== failedSource
      ? normalizedSource
      : normalizedFallback;

  if (!displayedSource) return null;

  return (
    <img
      {...props}
      src={displayedSource}
      onError={(event) => {
        // Remember the primary source, not the fallback. A failed fallback must
        // not cause the two sources to alternate on every error event.
        setFailedSource(normalizedSource);
        onError?.(event);
      }}
    />
  );
}
