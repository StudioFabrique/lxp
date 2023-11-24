import CardListItem from "../UI/card-list-item";
import ModuleCard from "./module-card";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface ModuleCardListProp {
  stepId: number;
  modulesList: any[];
}

const ModuleCardList = ({ stepId, modulesList }: ModuleCardListProp) => {
  return (
    <>
      {modulesList && modulesList.length > 0 ? (
        <CardListItem>
          {modulesList.map((item) => (
            <li key={item.id}>
              <ModuleCard stepId={stepId} module={item} />
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
