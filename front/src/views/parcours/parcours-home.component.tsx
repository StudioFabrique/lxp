import { MouseEvent, MouseEventHandler, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import useHttp from "../../hooks/use-http";
import Parcours from "../../utils/interfaces/parcours";
import Loader from "../../components/UI/loader";
import { sortArray } from "../../utils/sortArray";
import EditIcon from "../../components/UI/svg/edit-icon";
import DeleteIcon from "../../components/UI/svg/delete-icon.compoenent";
import { event } from "cypress/types/jquery";

const ParcoursHome = () => {
  const [parcoursList, setParcoursList] = useState<Array<Parcours> | null>(
    null
  );
  const { sendRequest, isLoading } = useHttp();
  const nav = useNavigate();

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

  const setDate = (value: string) => {
    return `${new Date(value).toLocaleDateString()} - ${new Date(
      value
    ).toLocaleTimeString()}`;
  };

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

  const handleViewParcours = (id: number) => {
    nav(`/admin/parcours/view/${id}`);
  };

  const content = (
    <>
      {parcoursList && parcoursList.length > 0 ? (
        <>
          {parcoursList.map((item: Parcours) => (
            <tr
              className="cursor-pointer hover:bg-secondary/20 hover:text-base-content"
              key={item.id}
              onClick={() => handleViewParcours(item.id!)}
            >
              <td>{item.id}</td>
              <td>{item.title}</td>
              <td>{item.formation.title}</td>
              <td>{item.formation.level}</td>
              <td>{setDate(item.createdAt!)}</td>
              <td>{setDate(item.updatedAt!)}</td>
              <td onClick={(e) => handleEditParcours(e, item.id!)}>
                <EditIcon />
              </td>
              <td onClick={(e) => handleDeleteParcours(e, item.id!)}>
                <DeleteIcon />
              </td>
            </tr>
          ))}
        </>
      ) : (
        <tr>
          <td colSpan={6}>Aucun parcours n'a été créé à ce jour</td>
        </tr>
      )}
    </>
  );

  return (
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
    </div>
  );
};

export default ParcoursHome;
