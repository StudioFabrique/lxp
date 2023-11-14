import Parcours from "../../utils/interfaces/parcours";
import ParcoursCard from "./parcours-card";

interface ParcoursCardsListProps {
  parcoursList: Parcours[];
}

const ParcoursCardsList = ({ parcoursList }: ParcoursCardsListProps) => {
  return (
    <div className="w-full min-h-[50%] flex justify-center items-center text-xs lg:text-sm">
      {parcoursList && parcoursList.length > 0 ? (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-y-8 gap-x-16 2xl:gap-x-8">
          {parcoursList.map((item) => (
            <li key={item.id}>
              <ParcoursCard parcours={item} />
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucun parcours trouvé</p>
      )}
    </div>
  );
};

export default ParcoursCardsList;
