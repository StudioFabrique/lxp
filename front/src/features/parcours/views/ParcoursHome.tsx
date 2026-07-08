/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useMemo, useState } from "react";

import useHttp from "../../../../src/hooks/useHttp";
import Parcours from "../../../../src/utils/interfaces/parcours";
import Loader from "../../../../src.legacy/components/UI/loader";
import { sortArray } from "../../../../src/utils/helpers/sort-array";
import toast from "react-hot-toast";
import ParcoursList from "../components/list/parcours-home";
import { useLocation } from "react-router";

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

  const getParcoursList = useCallback(() => {
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

  useEffect(() => {
    getParcoursList();
  }, [currentRoute, getParcoursList]);

  useEffect(() => {
    if (error.length > 0) toast.error(error);
  }, [error]);

  return (
    <div>
      {isLoading ? (
        <div className="flex items-center">
          <Loader />
        </div>
      ) : (
        <>
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
