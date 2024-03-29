/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";

import useHttp from "../../hooks/use-http";
import Parcours from "../../utils/interfaces/parcours";
import Loader from "../../components/UI/loader";
import { sortArray } from "../../utils/sortArray";
import toast from "react-hot-toast";
import ParcoursList from "../../components/parcours-home/parcours-home";
import { useLocation } from "react-router-dom";

const ParcoursHome = () => {
  const { pathname } = useLocation();

  const currentRoute = useMemo(
    () => pathname.split("/").slice(1) ?? [],
    [pathname]
  );

  const [parcoursList, setParcoursList] = useState<Array<Parcours> | null>(
    null
  );
  const { sendRequest, isLoading, error } = useHttp();

  /**
   * retourne la liste de tous les parcours pour les afficher à l'écran
   */
  useEffect(() => {
    const applyData = (data: any) => {
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

  // gestion des erreurs HTTP
  useEffect(() => {
    if (error.length > 0) toast.error(error);
  }, [error]);

  return (
    <main className="w-full min-h-screen flex justify-center ">
      {isLoading ? (
        <div className="flex items-center">
          <Loader />
        </div>
      ) : (
        <>
          {parcoursList ? <ParcoursList parcoursList={parcoursList} /> : null}
        </>
      )}
    </main>
  );
};

export default ParcoursHome;
