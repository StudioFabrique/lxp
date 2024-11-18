import Parcours from "../../utils/interfaces/parcours";
import CardListItem from "../UI/card-list-item";
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
        <p>Aucun parcours trouvé.</p>
      )}
    </>
  );
};

export default ParcoursCardsList;
