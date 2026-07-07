import Parcours from "../../../../../src.legacy/utils/interfaces/parcours";
import CardListItem from "../../../../../src.legacy/components/UI/card-list-item";
import ElementNotFound from "../../../../../src.legacy/components/UI/element-not-found";
import ParcoursCard from "./parcours-card";

interface ParcoursCardsListProps {
  parcoursList: Parcours[];
  onDeleteParcours: (parcours: Parcours) => void;
  loading: boolean;
}

const ParcoursCardsList = (props: ParcoursCardsListProps) => {
  const { parcoursList, onDeleteParcours } = props;
  return (
    <>
      {parcoursList && parcoursList.length > 0 ? (
        <CardListItem>
          {parcoursList.map((item) => (
            <li key={item.id}>
              <ParcoursCard
                parcours={item}
                onDeleteParcours={onDeleteParcours}
              />
            </li>
          ))}
        </CardListItem>
      ) : (
        <ElementNotFound message="Aucun parcours trouvé." />
      )}
    </>
  );
};

export default ParcoursCardsList;
