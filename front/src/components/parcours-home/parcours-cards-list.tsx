import Parcours from "../../utils/interfaces/parcours";
import CardListItem from "../UI/card-list-item";
import ParcoursCard from "./parcours-card";

interface ParcoursCardsListProps {
  parcoursList: Parcours[];
}

const ParcoursCardsList = ({ parcoursList }: ParcoursCardsListProps) => {
  return (
    <>
      {parcoursList && parcoursList.length > 0 ? (
        <CardListItem>
          {parcoursList.map((item) => (
            <li key={item.id}>
              <ParcoursCard parcours={item} />
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
