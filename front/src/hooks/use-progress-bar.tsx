import { useEffect, useState } from "react";
import { autoSubmitTimer } from "../config/auto-submit-timer";

/**
 * Custom hook qui doit être utilisé en complément du composant ProgressBarWrapper
 * @param formValidation valeur booléenne à passer pour indiquer si les champs du formulaire sont respectés
 */

const useProgressBar = (formValidation: boolean) => {
  const [loader, setLoader] = useState<{
    lastTime: number;
    loadingRate: number;
  }>({
    lastTime: Date.now(),
    loadingRate: 0,
  });

  const [currentFocusValueLength, setCurrentFocusValueLength] = useState(0);

  const [isReadyToSendRequest, setReadyToSendRequest] = useState(false);

  const [intervalId, setIntervalId] = useState<NodeJS.Timer | null>(null);

  /**
   * Les types de résultat de la requête au backend
   */

  const [fetchResultType, setFetchResultType] = useState<
    "success" | "error" | "loading" | "none"
  >("none");

  /**
   * State à surveiller dans un useEffect dans le composant parent afin de décider si un handleSubmit est possible
   */

  const [canSendRequestNow, setCanSendRequestNow] = useState(false);

  /**
   * Initialise les valeurs des propriétés du hook permettant le déclenchement du timer avant le submit
   * Utilisation dans le composant parent : lors du changement d'un input
   * @param currentFocusValueLength taille de la valeur du dernier input (permet d'aider l'actualisation de la logique)
   */
  const handlePrepareRequest = (currentFocusValueLength: number) => {
    setFetchResultType("none");
    setCurrentFocusValueLength(currentFocusValueLength);
    if (intervalId) clearInterval(intervalId);
    setReadyToSendRequest(true);
  };

  /**
   * Permet d'empêcher la prochaine itération du submit et stop le timer
   * Utilisation dans le composant parent : Après avoir submit les données
   */

  const handleStopRequest = () => {
    setCanSendRequestNow(false);
    setReadyToSendRequest(false);
  };

  /**
   * Affiche conditionellement un petit composant d'affichage de l'état de la requête à afficher à côté du titre du formulaire
   * @returns Composant JSX
   */

  const componentFetchType = () => {
    switch (fetchResultType) {
      case "success":
        return (
          <span className="pr-2 self-end">
            <p className="text-green-400">&#10003;</p>
          </span>
        );
      case "error":
        return (
          <span className="pr-2">
            <p>erreur</p>
          </span>
        );
      case "loading":
        return <span className="loading loading-spinner loading-xs" />;
      case "none":
        return <span className="" />;
      default:
        return undefined;
    }
  };

  useEffect(() => {
    if (isReadyToSendRequest && formValidation && currentFocusValueLength > 0) {
      setLoader({
        lastTime: Date.now(),
        loadingRate: 0,
      });
    }

    /**
     * On fait passer le pourcentage de "loadingRate" à 1.2 si un fetch de la base de données a été
     * effectué afin que la progress bar puisse se remplisse instantanément de 1 à 1.2
     */
    if (fetchResultType === "success" || fetchResultType === "error") {
      setLoader((currentLoader) => {
        return {
          lastTime: currentLoader.lastTime,
          loadingRate: 1.2,
        };
      });
    }
  }, [
    fetchResultType,
    formValidation,
    isReadyToSendRequest,
    currentFocusValueLength,
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const timeElapsed = Date.now() - loader.lastTime;
      const loadingRate = timeElapsed / autoSubmitTimer;

      if (
        isReadyToSendRequest &&
        formValidation &&
        currentFocusValueLength > 0 &&
        timeElapsed > autoSubmitTimer
      ) {
        setCanSendRequestNow(true);
      }

      if (
        isReadyToSendRequest &&
        formValidation &&
        currentFocusValueLength > 0 &&
        fetchResultType === "none"
      ) {
        setLoader((currentLoader) => {
          return {
            lastTime: currentLoader.lastTime,
            loadingRate: loadingRate > 1 ? 1 : loadingRate,
          };
        });
      }
    }, 100);
    setIntervalId(interval);

    return () => clearInterval(interval);
  }, [
    fetchResultType,
    formValidation,
    isReadyToSendRequest,
    loader.lastTime,
    currentFocusValueLength,
  ]);

  return {
    loader,
    componentFetchType,
    setFetchResultType,
    handlePrepareRequest,
    handleStopRequest,
    canSendRequestNow,
  };
};

export default useProgressBar;
