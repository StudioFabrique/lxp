import { MouseEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import useHttp from "../../hooks/use-http";
import Parcours from "../../utils/interfaces/parcours";
import Loader from "../../components/UI/loader";
import { sortArray } from "../../utils/sortArray";
import EditIcon from "../../components/UI/svg/edit-icon";
import DeleteIcon from "../../components/UI/svg/delete-icon.component";
import Can from "../../components/UI/can/can.component";
import toast from "react-hot-toast";
import ParcoursList from "../../components/parcours-home/parcours-home";

const ParcoursHome = () => {
  const [parcoursList, setParcoursList] = useState<Array<Parcours> | null>(
    null
  );
  const { sendRequest, error } = useHttp();
  const nav = useNavigate();

  /**
   * retourne la liste de tous les parcours pour les afficher à l'écran
   */
  useEffect(() => {
    const applyData = (data: any) => {
      setParcoursList(sortArray(data, "id"));
    };
    sendRequest(
      {
        path: "/parcours",
      },
      applyData
    );
  }, [sendRequest]);

  /**
   * formate les dates venant de la bdd en quelque chose de plus agréable à lire
   * @param value string
   * @returns
   */
  const setDate = (value: string) => {
    return `${new Date(value).toLocaleDateString()} - ${new Date(
      value
    ).toLocaleTimeString()}`;
  };

  /**
   * navique vers la vue édition du parcours
   * @param e MouseEvent<HTMLTableCellElement>
   * @param id number
   */
  const handleEditParcours = (
    e: MouseEvent<HTMLTableCellElement>,
    id: number
  ) => {
    e.stopPropagation();
    nav(`/admin/parcours/edit/${id}`);
  };

  const handleDeleteParcours = (
    e: MouseEvent<HTMLTableCellElement>,
    id: number
  ) => {
    e.stopPropagation();
  };

  /**
   * navigue vers la vue aperçu du parcours
   * @param id number
   */
  const handleViewParcours = (id: number) => {
    nav(`view/${id}`);
  };

  // gestion des erreurs HTTP
  useEffect(() => {
    if (error.length > 0) toast.error(error);
  }, [error]);

  return (
    /* 
    <div className="w-full min-h-[50%] flex justify-center items-center">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {parcoursList && parcoursList.length > 0 ? (
            <div className="w-4/6">
              <table className="table">
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Titre</th>
                    <th>Formation</th>
                    <th>Niveau</th>
                    <th>Crée le</th>
                    <th>Mis à jour le</th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>{content}</tbody>
              </table>
            </div>
          ) : (
            <p>Aucun parcours n'a été créé à ce jour</p>
          )}
        </>
      )}
    </div> */
    <main className="w-full flex justify-center">
      {parcoursList && parcoursList?.length > 0 ? (
        <ParcoursList parcoursList={parcoursList} />
      ) : null}
    </main>
  );
};

export default ParcoursHome;
