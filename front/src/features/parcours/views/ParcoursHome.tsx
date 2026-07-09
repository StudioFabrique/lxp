import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { parcoursApi } from "../api/parcours.api";
import Loader from "../../../../src/components/loaders/Loader";
import { sortArray } from "../../../../src/utils/helpers/sort-array";
import ParcoursList from "../components/list/parcours-home";
import { useLocation } from "react-router";

const ParcoursHome = () => {
  const { pathname } = useLocation();

  const currentRoute = useMemo(
    () => pathname.split("/").slice(1) ?? [],
    [pathname]
  );

  const asStudent = currentRoute[0] === "student";

  const {
    data: parcoursList,
    isLoading,
    refetch: refreshParcoursList,
  } = useQuery({
    queryKey: ["parcours", { asStudent }],
    queryFn: () => parcoursApi.queries.getAll(asStudent),
    select: (data) => sortArray(data, "id"),
  });

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
              onRefreshParcoursList={refreshParcoursList}
            />
          ) : null}
        </>
      )}
    </div>
  );
};

export default ParcoursHome;
