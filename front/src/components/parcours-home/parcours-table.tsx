import { useNavigate } from "react-router-dom";
import { localeDate } from "../../helpers/locale-date";
import Parcours from "../../utils/interfaces/parcours";
import Can from "../UI/can/can.component";
import EditIcon from "../UI/svg/edit-icon";

interface ParcoursTableProps {
  parcoursList: Parcours[];
}

const ParcoursTable = (props: ParcoursTableProps) => {
  const { parcoursList } = props;
  const nav = useNavigate();

  const handleEditParcours = (id: number) => {
    nav(`/edit/${id}`);
  };

  // contenu du tableau
  const content = (
    <>
      {parcoursList && parcoursList.length > 0 ? (
        <>
          {parcoursList.map((item: Parcours) => (
            <tr
              className="cursor-pointer hover:bg-secondary/20 hover:text-base-content"
              key={item.id}
            >
              <td>{item.id}</td>
              <td>{item.title}</td>
              <td>{item.formation.title}</td>
              <td>{item.formation.level}</td>
              <td>{localeDate(item.createdAt!)}</td>
              <td>{localeDate(item.updatedAt!)}</td>
              <td onClick={(e) => handleEditParcours(item.id!)}>
                <div className="w-6 h-6">
                  <Can action="update" object="parcours">
                    <EditIcon />
                  </Can>
                </div>
              </td>
              <td onClick={(e) => handleDeleteParcours(e, item.id!)}>
                <div className="w-6 h-6 text-error">
                  <Can action="delete" object="parcours">
                    <DeleteIcon />
                  </Can>
                </div>
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

  return <></>;
};

export default ParcoursTable;
