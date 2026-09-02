import { Navigate, Outlet, useParams } from "react-router";

import Loader from "../../../../components/loaders/Loader";
import { useParcoursQuery } from "../../hooks/useParcoursQuery";

/** Empêche l'ouverture de l'éditeur pour un parcours seulement consultable. */
export default function RequireParcoursManagement() {
  const { id } = useParams();
  const parcoursId = Number(id);
  const { data: parcours, isLoading, isError } = useParcoursQuery(parcoursId);

  if (isLoading) return <Loader />;
  if (
    isError ||
    !Number.isInteger(parcoursId) ||
    parcoursId <= 0 ||
    parcours?.canManage === false
  ) {
    return <Navigate replace to="/access-denied" />;
  }

  return parcours ? <Outlet /> : <Loader />;
}
