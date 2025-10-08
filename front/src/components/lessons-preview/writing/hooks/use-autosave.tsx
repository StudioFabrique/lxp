import { useCallback, useEffect, useRef, useState } from "react";

type AutosaveData = {
  title?: string;
  content?: string;
  timestamp: number;
  activityId?: number;
};

type Props = {
  title?: string;
  content?: string;
  activityId?: number;
  onEditTitle: (title: string) => void;
  onEditContent: (content: string) => void;
};

// Fonction debounce personnalisée
function debounce<T extends (...args: AutosaveData[]) => void>(
  func: T,
  delay: number
): T & { cancel: () => void } {
  let timeoutId: NodeJS.Timeout;

  const debouncedFunction = ((...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  }) as T & { cancel: () => void };

  debouncedFunction.cancel = () => {
    clearTimeout(timeoutId);
  };

  return debouncedFunction;
}

export default function useAutosave({
  title,
  content,
  activityId,
  onEditTitle,
  onEditContent,
}: Props) {
  const [hasAutosavedContent, setHasAutosavedContent] =
    useState<boolean>(false);
  const [lastAutosaveTime, setLastAutosaveTime] = useState<Date | null>(null);
  const [showAutosaveIndicator, setShowAutosaveIndicator] =
    useState<boolean>(false);
  const initialLoadRef = useRef<boolean>(true);

  // Génère une clé unique pour l'activité
  const getStorageKey = useCallback(() => {
    return `autosave_new_activity_${activityId}`;
  }, [activityId]);

  // Sauvegarde les données dans le localStorage
  const saveToStorage = (data: AutosaveData) => {
    try {
      localStorage.setItem(getStorageKey(), JSON.stringify(data));
      setLastAutosaveTime(new Date());
      setHasAutosavedContent(true);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde automatique:", error);
    }
  };

  // Récupère les données du localStorage
  const getFromStorage = useCallback((): AutosaveData | null => {
    try {
      const stored = localStorage.getItem(getStorageKey());
      if (stored) {
        const data = JSON.parse(stored) as AutosaveData;
        // Vérifie que les données correspondent à la même leçon et activité
        if (data.activityId === activityId) {
          return data;
        }
      }
      return null;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération de la sauvegarde automatique:",
        error
      );
      return null;
    }
  }, [getStorageKey, activityId]);

  // Supprime les données du localStorage
  const clearStorage = () => {
    try {
      localStorage.removeItem(getStorageKey());
      setHasAutosavedContent(false);
      setLastAutosaveTime(null);
    } catch (error) {
      console.error(
        "Erreur lors de la suppression de la sauvegarde automatique:",
        error
      );
    }
  };

  // Nettoie les anciennes sauvegardes (plus de 24h)
  const cleanupOldAutosaves = () => {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("autosave_")) {
          try {
            const data = JSON.parse(localStorage.getItem(key) || "");
            const age = Date.now() - data.timestamp;
            const twentyFourHours = 24 * 60 * 60 * 1000;

            if (age > twentyFourHours) {
              keysToRemove.push(key);
            }
          } catch {
            // Si on ne peut pas parser, on supprime
            keysToRemove.push(key);
          }
        }
      }

      keysToRemove.forEach((key) => localStorage.removeItem(key));
    } catch (error) {
      console.error(
        "Erreur lors du nettoyage des anciennes sauvegardes:",
        error
      );
    }
  };

  // Fonction de sauvegarde avec debounce
  const debouncedSave = useRef(
    debounce((data: AutosaveData) => {
      saveToStorage(data);
    }, 2000)
  ).current;

  // Restaure les données au chargement initial
  const restoreAutosavedContent = useCallback(() => {
    // Nettoie les anciennes sauvegardes au chargement
    cleanupOldAutosaves();

    const autosavedData = getFromStorage();
    if (autosavedData) {
      setHasAutosavedContent(true);
      setLastAutosaveTime(new Date(autosavedData.timestamp));
      return {
        title: autosavedData.title,
        content: autosavedData.content,
        wasRestored: true, // Indique qu'il s'agit d'une restauration
      };
    }
    return {
      title: "",
      content: "",
      wasRestored: false, // Pas de restauration
    };
  }, [getFromStorage]);

  // Effet pour restaurer le contenu autosauvegardé au chargement
  useEffect(() => {
    const autosavedData = restoreAutosavedContent();
    const autoSavedContentLength =
      autosavedData?.content?.replace(/<[^>]+>/g, "").length || 0;

    if (autosavedData.wasRestored) {
      onEditTitle(autosavedData.title || "");
      onEditContent(autosavedData.content || "");
      autoSavedContentLength > 0 && setShowAutosaveIndicator(true);
    }
  }, [restoreAutosavedContent, onEditTitle, onEditContent]);

  // Effet pour cacher l'indicateur d'autosave après un délai
  useEffect(() => {
    if (showAutosaveIndicator) {
      const timer = setTimeout(() => {
        setShowAutosaveIndicator(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showAutosaveIndicator]);

  // Effet pour sauvegarder automatiquement lors des changements
  useEffect(() => {
    // Ne pas sauvegarder lors du chargement initial
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      return;
    }

    // Ne sauvegarde que si il y a du contenu ou un titre
    if (title?.trim() || content?.trim()) {
      const autosaveData: AutosaveData = {
        title,
        content,
        timestamp: Date.now(),
        activityId,
      };

      debouncedSave(autosaveData);
    }
  }, [title, content, activityId, debouncedSave]);

  // Nettoie le debounce lors du démontage du composant
  useEffect(() => {
    return () => {
      debouncedSave.cancel();
    };
  }, [debouncedSave]);

  return {
    hasAutosavedContent,
    lastAutosaveTime,
    showAutosaveIndicator,
    restoreAutosavedContent,
    clearStorage,
  };
}
