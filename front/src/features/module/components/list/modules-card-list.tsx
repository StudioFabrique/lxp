import CardListItem from "../../../../components/UI/card-list-item";
import ElementNotFound from "../../../../components/UI/element-not-found";
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
        <ElementNotFound message="Aucun module trouvé." />
      )}
    </>
  );
};

export default ModuleCardList;
