import CardListItem from "../UI/card-list-item";
import ModuleCard from "./module-card";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface ModuleCardListProp {
  modulesList: any[];
}

const ModuleCardList = ({ modulesList }: ModuleCardListProp) => {
  return (
    <>
      {modulesList && modulesList.length > 0 ? (
        <CardListItem>
          {modulesList.map((item) => (
            <li key={item.id}>
              <ModuleCard module={item} />
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
