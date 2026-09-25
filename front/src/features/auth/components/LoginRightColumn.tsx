import { useState } from "react";
import bgPhoto from "../assets/bg-photo.jpeg";
import { AuthBackground } from "../api/backgrounds.api";
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
  const [failedBackgroundId, setFailedBackgroundId] = useState<string | null>(
    null,
  );
  const [loadedUnsplashId, setLoadedUnsplashId] = useState<string | null>(null);
  const displayedBackground =
    background?.id === failedBackgroundId ? null : background;
  const isUnsplashReady =
    displayedBackground !== null && loadedUnsplashId === displayedBackground.id;

  return (
    <div className={cn("hidden lg:flex flex-col items-end relative w-full h-full", alignTop ? "justify-start" : "justify-center")}>
      {/* Skeleton pulse en attendant le chargement */}
      {!displayedBackground && !failedBackgroundId && !isFailed && (
        <div
          className={cn("h-full max-h-[85vh] min-h-150 rounded-l-2xl bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse", gridMaskClassName)}
        />
      )}

      {/* Image de secours uniquement en cas d'erreur */}
      {(failedBackgroundId || isFailed) && (
        <img
          src={bgPhoto}
          alt="Décoration"
          className={cn("h-full max-h-[85vh] min-h-150 object-cover rounded-l-2xl", gridMaskClassName)}
        />
      )}

      {/* Image Unsplash par-dessus, fondu une fois chargée */}
      {displayedBackground && (
        <img
          key={displayedBackground.id}
          src={displayedBackground.url}
          alt={displayedBackground.alt}
          onLoad={() => setLoadedUnsplashId(displayedBackground.id)}
          onError={() => setFailedBackgroundId(background?.id ?? null)}
          className={cn("absolute h-full max-h-[85vh] min-h-150 object-cover rounded-l-2xl transition-opacity duration-700", gridMaskClassName, isUnsplashReady ? "opacity-100" : "opacity-0")}
        />
      )}
    </div>
  );
};

export default LoginRightColumn;
