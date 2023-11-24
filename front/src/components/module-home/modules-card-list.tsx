import CardListItem from "../UI/card-list-item";
import ModuleCard from "./module-card";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface ModuleCardListProp {
  stepId: number;
  modulesList: any[];
  onDelete: (id: number) => void;
}

const ModuleCardList = ({
  stepId,
  modulesList,
  onDelete,
}: ModuleCardListProp) => {
  return (
    <>
      {modulesList && modulesList.length > 0 ? (
        <CardListItem>
          {modulesList.map((item) => (
            <li key={item.id}>
              <ModuleCard stepId={stepId} module={item} onDelete={onDelete} />
            </li>
          ))}
        </CardListItem>
      ) : (
        <p>Aucun module trouvé</p>
      )}
    </>
  );
};

export default ModuleCardList;
