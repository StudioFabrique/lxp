import { useState } from "react";
import bgPhoto from "../assets/bg-photo.jpeg";
import { AuthBackground } from "../api/backgrounds.api";
import AuthFlipTiles from "./AuthFlipTiles";
import { cn } from "../../../utils/cn";

// Tuile de 300 × 250 px, espacement de 10 px et décalage du motif d’origine.
const gridMaskClassName =
  "mask-[url(/masks/login-tile.svg)] mask-repeat mask-size-[310px_260px] mask-position-[-160px_-80px]";

type Props = {
  background: AuthBackground | null;
  isFailed: boolean;
  alignTop?: boolean;
};

const LoginRightColumn = ({ background, isFailed, alignTop = false }: Props) => {
  const [clipPath, setClipPath] = useState("");
  const [readyImage, setReadyImage] = useState<HTMLImageElement | null>(null);
  const [failedBackgroundId, setFailedBackgroundId] = useState<string | null>(null);
  const [loadedBackground, setLoadedBackground] = useState<Pick<AuthBackground, "url" | "alt"> | null>(null);
  const useFallback = isFailed || (background !== null && background.id === failedBackgroundId);
  // Keep the last loaded photo while the next theme's photo is downloading.
  // The image element and interactive cards stay mounted across theme changes.
  const source = useFallback
    ? { url: bgPhoto, alt: "Décoration" }
    : loadedBackground;

  return (
    <div className={cn("hidden lg:flex flex-col items-end relative w-full h-full", alignTop ? "justify-start" : "justify-center")}>
      {background && !useFallback && (
        <img key={background.id} src={background.url} alt="" aria-hidden="true" className="hidden"
          onLoad={() => setLoadedBackground(background)}
          onError={() => setFailedBackgroundId(background.id)} />
      )}
      {!source && (
        <div className={cn("w-full h-full max-h-[85vh] min-h-150 rounded-l-2xl bg-gradient-to-br from-base-300 via-base-200 to-base-300 animate-pulse motion-reduce:animate-none", gridMaskClassName)} />
      )}
      {source && (
        <img src={source.url} alt={source.alt}
          onLoad={(event) => {
            setReadyImage(event.currentTarget);
            if (useFallback) setLoadedBackground({ url: bgPhoto, alt: "Décoration" });
          }}
          className={cn("h-full max-h-[85vh] min-h-150 object-cover rounded-l-2xl", gridMaskClassName)}
          style={{ clipPath }} />
      )}
      {readyImage && source && (
        <AuthFlipTiles image={readyImage} imageSrc={source.url} onClipPathChange={setClipPath} />
      )}
    </div>
  );
};

export default LoginRightColumn;
