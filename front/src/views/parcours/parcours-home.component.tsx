import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import useHttp from "../../hooks/use-http";
import Parcours from "../../utils/interfaces/parcours";
import Loader from "../../components/UI/loader";
import { sortArray } from "../../utils/sortArray";

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

  const handleEditParcours = (id: number) => {
    nav(`/admin/parcours/edit/${id}`);
  };

  const content = (
    <>
      {parcoursList && parcoursList.length > 0 ? (
        <>
          {parcoursList.map((item: Parcours) => (
            <tr
              className="cursor-pointer"
              key={item.id}
              onClick={() => handleEditParcours(item.id!)}
            >
              <td>{item.id}</td>
              <td>{item.title}</td>
              <td>{item.formation.title}</td>
              <td>{item.formation.level}</td>
              <td>{setDate(item.createdAt!)}</td>
              <td>{setDate(item.updatedAt!)}</td>
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
