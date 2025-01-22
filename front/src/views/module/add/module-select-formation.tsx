import Selecter from "../../../components/UI/selecter/selecter.component";
import { Item } from "./use-module-add";

type Props = {
  formationsList: Item[];
  parcoursList: Item[];
  onSelectFormation: (id: number) => void;
  onSelectParcours: (id: number) => void;
};

function ModuleSelectFormation({
  formationsList,
  parcoursList,
  onSelectFormation,
  onSelectParcours,
}: Props) {
  return (
    <div className="flex flex-col gap-y-4">
      <Selecter
        list={formationsList}
        title="A quelle formation souhaitez-vous attacher ce module ?"
        onSelectItem={onSelectFormation}
      />
      <p>
        Si vous souhaitez attacher ce module à un parcours, veuillez
        sélectionner un parcours ci-dessous. Il vous sera toujours possible de
        rattacher ce module à un parcours plus tard.
      </p>
      <Selecter
        list={parcoursList}
        title="Souhaitez-vous attacher ce module à un parcours ?"
        onSelectItem={onSelectParcours}
      />
    </div>
  );
}

export default ModuleSelectFormation;
