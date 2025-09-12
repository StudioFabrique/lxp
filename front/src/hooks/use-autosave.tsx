import { useCallback, useEffect, useRef, useState } from "react";

type AutosaveData = {
  title: string;
  content: string;
  timestamp: number;
  parentId: number;
  activityId?: number;
};

type UseAutosaveOptions = {
  title: string;
  content: string;
  parentId: number;
  activityId?: number;
  delay?: number;
  isNewActivity?: boolean;
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

export const useAutosave = ({
  title,
  content,
  parentId,
  activityId,
  delay = 2000,
  isNewActivity = false,
}: UseAutosaveOptions) => {
  const [hasAutosavedContent, setHasAutosavedContent] =
    useState<boolean>(false);
  const [lastAutosaveTime, setLastAutosaveTime] = useState<Date | null>(null);
  const initialLoadRef = useRef<boolean>(true);

  // Génère une clé unique pour l'activité
  const getStorageKey = useCallback(() => {
    if (isNewActivity) {
      return `autosave_new_activity_${parentId}`;
    }
    return `autosave_activity_${activityId || "new"}_${parentId}`;
  }, [activityId, isNewActivity, parentId]);

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
        if (
          data.parentId === parentId &&
          (isNewActivity || data.activityId === activityId)
        ) {
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
  }, [getStorageKey, parentId, activityId, isNewActivity]);

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
    }, delay)
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

  // Effet pour sauvegarder automatiquement lors des changements
  useEffect(() => {
    // Ne pas sauvegarder lors du chargement initial
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      return;
    }

    // Ne sauvegarde que si il y a du contenu ou un titre
    if (title.trim() || content.trim()) {
      const autosaveData: AutosaveData = {
        title,
        content,
        timestamp: Date.now(),
        parentId,
        activityId,
      };

      debouncedSave(autosaveData);
    }
  }, [title, content, parentId, activityId, debouncedSave]);

  // Nettoie le debounce lors du démontage du composant
  useEffect(() => {
    return () => {
      debouncedSave.cancel();
    };
  }, [debouncedSave]);

  return {
    hasAutosavedContent,
    lastAutosaveTime,
    restoreAutosavedContent,
    clearStorage,
  };
};
