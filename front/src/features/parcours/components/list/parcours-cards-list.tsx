import Parcours from "../../../../../src/utils/interfaces/parcours";
import EntityCardsList from "../../../../components/UI/entity-cards-list";
import ParcoursCard from "./parcours-card";

interface ParcoursCardsListProps {
  parcoursList: Parcours[];
  onDeleteParcours: (parcours: Parcours) => void;
}

const ParcoursCardsList = ({
  parcoursList,
  onDeleteParcours,
}: ParcoursCardsListProps) => {
  return (
    <EntityCardsList
      items={parcoursList}
      emptyMessage="Aucun parcours trouvé."
      renderItem={(parcours) => (
        <ParcoursCard parcours={parcours} onDeleteParcours={onDeleteParcours} />
      )}
    />
  );
};

export default ParcoursCardsList;
