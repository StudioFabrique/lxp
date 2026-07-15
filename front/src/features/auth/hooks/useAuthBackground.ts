import { useEffect, useState } from "react";
import {
  AuthBackground,
  AuthBackgroundTheme,
  backgroundApi,
} from "../api/backgrounds.api";

const ROTATION_INTERVAL_MS = 10 * 60 * 1000;

const getCurrentIndex = (photoCount: number) =>
  Math.floor(Date.now() / ROTATION_INTERVAL_MS) % photoCount;

export const useAuthBackground = (theme: AuthBackgroundTheme) => {
  const [photosByTheme, setPhotosByTheme] = useState<
    Record<AuthBackgroundTheme, AuthBackground[]>
  >({ light: [], dark: [] });
  const [indexesByTheme, setIndexesByTheme] = useState<
    Record<AuthBackgroundTheme, number>
  >({ light: 0, dark: 0 });
  const photos = photosByTheme[theme];

  useEffect(() => {
    const desktopMediaQuery = window.matchMedia("(min-width: 1024px)");
    let isActive = true;

    const loadBackgrounds = () => {
      if (!desktopMediaQuery.matches || photos.length > 0) return;

      void backgroundApi
        .getAuthBackgrounds(theme)
        .then((backgrounds) => {
          if (!isActive || backgrounds.length === 0) return;

          setPhotosByTheme((current) => ({
            ...current,
            [theme]: backgrounds,
          }));
          setIndexesByTheme((current) => ({
            ...current,
            [theme]: getCurrentIndex(backgrounds.length),
          }));
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
  }, [photos.length, theme]);

  useEffect(() => {
    if (photos.length < 2) return;

    const interval = window.setInterval(() => {
      setIndexesByTheme((current) => ({
        ...current,
        [theme]: (current[theme] + 1) % photos.length,
      }));
    }, ROTATION_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, [photos.length, theme]);

  return photos[indexesByTheme[theme]] ?? null;
};
