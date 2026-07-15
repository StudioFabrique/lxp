import { useState } from "react";
import bgPhoto from "../assets/bg-photo.jpeg";
import { AuthBackground } from "../api/backgrounds.api";

type Props = {
  background: AuthBackground | null;
  isFailed: boolean;
};

const LoginRightColumn = ({ background, isFailed }: Props) => {
  const [failedBackgroundId, setFailedBackgroundId] = useState<string | null>(
    null,
  );
  const [loadedUnsplashId, setLoadedUnsplashId] = useState<string | null>(null);
  const displayedBackground =
    background?.id === failedBackgroundId ? null : background;
  const isUnsplashReady =
    displayedBackground !== null && loadedUnsplashId === displayedBackground.id;

  // Constantes sorties de la boucle pour faciliter les réglages
  const gridSize = 10;
  const squareSize = 300;
  const gap = 10;
  const radius = 15;

  const generateGridMask = () => {
    const rects = [];
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        rects.push(
          <rect
            key={`${i}-${j}`}
            x={j * (squareSize + gap)}
            y={i * (squareSize + gap - 50)}
            width={squareSize}
            height={squareSize - 50}
            rx={radius}
          />,
        );
      }
    }
    return rects;
  };

  return (
    <div className="hidden lg:flex flex-col justify-center items-end relative w-full h-full">
      <svg className="absolute">
        <defs>
          <clipPath
            id="image-grid-mask"
            className="-translate-x-40 -translate-y-20"
          >
            {generateGridMask()}
          </clipPath>
        </defs>
      </svg>

      {/* Skeleton pulse en attendant le chargement */}
      {!displayedBackground && !failedBackgroundId && !isFailed && (
        <div
          className="h-full max-h-[85vh] min-h-150 rounded-l-2xl bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse"
          style={{ clipPath: "url(#image-grid-mask)" }}
        />
      )}

      {/* Image de secours uniquement en cas d'erreur */}
      {(failedBackgroundId || isFailed) && (
        <img
          src={bgPhoto}
          alt="Décoration"
          className="h-full max-h-[85vh] min-h-150 object-cover rounded-l-2xl"
          style={{ clipPath: "url(#image-grid-mask)" }}
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
          className={`absolute h-full max-h-[85vh] min-h-150 object-cover rounded-l-2xl transition-opacity duration-700 ${isUnsplashReady ? "opacity-100" : "opacity-0"}`}
          style={{ clipPath: "url(#image-grid-mask)" }}
        />
      )}
    </div>
  );
};

export default LoginRightColumn;
