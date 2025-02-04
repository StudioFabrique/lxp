import Selecter from "../../../components/UI/selecter/selecter.component";
import { Item } from "./use-module-add";

/**
 * Props du composant ModuleSelectFormation
 * @typedef {Object} Props
 * @property {Item[]} formationsList - Liste des formations disponibles
 * @property {Item[]} parcoursList - Liste des parcours disponibles
 * @property {function} onSelectFormation - Fonction appelée lors de la sélection d'une formation
 * @property {function} onSelectParcours - Fonction appelée lors de la sélection d'un parcours
 */
type Props = {
  formationsList: Item[];
  parcoursList: Item[];
  onSelectFormation: (id: number) => void;
  onSelectParcours: (id: number) => void;
};

/**
 * Composant permettant de sélectionner une formation et optionnellement un parcours
 * pour y attacher un nouveau module
 *
 * @param {Props} props - Les propriétés du composant
 * @returns {JSX.Element} Le composant de sélection de formation/parcours
 */
function ModuleSelectFormation({
  formationsList,
  parcoursList,
  onSelectFormation,
  onSelectParcours,
}: Props) {
  return (
    <div className="flex flex-col gap-y-4">
      {/* Sélecteur de formation */}
      <Selecter
        list={formationsList}
        title="A quelle formation souhaitez-vous attacher ce module ?"
        onSelectItem={onSelectFormation}
      />
      {/* Message explicatif pour la sélection de parcours */}
      <p>
        Si vous souhaitez attacher ce module à un parcours, veuillez
        sélectionner un parcours ci-dessous. Il vous sera toujours possible de
        rattacher ce module à un parcours plus tard.
      </p>
      {/* Sélecteur de parcours optionnel */}
      <Selecter
        list={parcoursList}
        title="Souhaitez-vous attacher ce module à un parcours ?"
        onSelectItem={onSelectParcours}
      />
    </div>
  );
}

export default ModuleSelectFormation;
