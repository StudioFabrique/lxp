import { useEffect, useState } from "react";
import {
  AuthBackground,
  backgroundApi
} from "../api/backgrounds.api";

const ROTATION_INTERVAL_MS = 10 * 60 * 1000;

const getCurrentIndex = (photoCount: number) =>
  Math.floor(Date.now() / ROTATION_INTERVAL_MS) % photoCount;

export const useAuthBackground = () => {
  const [photos, setPhotos] = useState<AuthBackground[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const desktopMediaQuery = window.matchMedia("(min-width: 1024px)");
    let isActive = true;

    const loadBackgrounds = () => {
      if (!desktopMediaQuery.matches || photos.length > 0) return;

      backgroundApi.getAuthBackgrounds()
        .then((backgrounds) => {
          if (!isActive || backgrounds.length === 0) return;
          setPhotos(backgrounds);
          setCurrentIndex(getCurrentIndex(backgrounds.length));
        })
        .catch(() => {
          // The bundled image remains visible when Unsplash is unavailable.
        });
    };

    loadBackgrounds();
    desktopMediaQuery.addEventListener("change", loadBackgrounds);

    return () => {
      isActive = false;
      desktopMediaQuery.removeEventListener("change", loadBackgrounds);
    };
  }, [photos.length]);

  useEffect(() => {
    if (photos.length < 2) return;

    const interval = window.setInterval(() => {
      setCurrentIndex((index) => (index + 1) % photos.length);
    }, ROTATION_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, [photos.length]);

  return photos[currentIndex] ?? null;
};
