/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useMemo, useState } from "react";

import useHttp from "../../hooks/use-http";
import Parcours from "../../utils/interfaces/parcours";
import Loader from "../../components/UI/loader";
import { sortArray } from "../../utils/sortArray";
import toast from "react-hot-toast";
import ParcoursList from "../../components/parcours-home/parcours-home";
import { useLocation } from "react-router";

/**
 * Composant principal affichant la liste des parcours
 * Gère l'affichage différent selon que l'utilisateur soit étudiant ou non
 */
const ParcoursHome = () => {
  // Récupère le chemin actuel de l'URL
  const { pathname } = useLocation();

  // Extrait les segments du chemin pour déterminer la route courante
  const currentRoute = useMemo(
    () => pathname.split("/").slice(1) ?? [],
    [pathname]
  );

  // État pour stocker la liste des parcours
  const [parcoursList, setParcoursList] = useState<Array<Parcours> | null>(
    null
  );

  // Hook personnalisé pour les requêtes HTTP
  const { sendRequest, isLoading, error } = useHttp();

  /**
   * Fonction pour récupérer la liste des parcours depuis l'API
   * Utilise une route différente selon que l'utilisateur soit étudiant ou non
   */
  const getParcoursList = useCallback(() => {
    const applyData = (data: any) => {
      // Trie les parcours par ID avant de les stocker dans l'état
      setParcoursList(sortArray(data, "id"));
    };
    sendRequest(
      {
        path:
          currentRoute[0] === "student"
            ? "/parcours/parcours-as-student"
            : "/parcours",
      },
      applyData
    );
  }, [currentRoute, sendRequest]);

  /**
   * Effect pour charger la liste des parcours au montage du composant
   * et lors du changement de route
   */
  useEffect(() => {
    getParcoursList();
  }, [currentRoute, getParcoursList]);

  /**
   * Effect pour afficher les erreurs HTTP via un toast
   */
  useEffect(() => {
    if (error.length > 0) toast.error(error);
  }, [error]);

  return (
    <div>
      {/* Affiche un loader pendant le chargement */}
      {isLoading ? (
        <div className="flex items-center">
          <Loader />
        </div>
      ) : (
        <>
          {/* Affiche la liste des parcours une fois chargée */}
          {parcoursList ? (
            <ParcoursList
              parcoursList={parcoursList}
              onRefreshParcoursList={getParcoursList}
            />
          ) : null}
        </>
      )}
    </div>
  );
};

export default ParcoursHome;
