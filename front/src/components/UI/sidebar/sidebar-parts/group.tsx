import { GroupIcon } from "lucide-react";
import { Link } from "react-router-dom";
import AddIcon from "../../svg/add-icon";
import Can from "../../can/can.component";

const Group = (props: { interfaceType: string }) => (
  <ul className="text-primary flex flex-col gap-y-4">
    <li>
      <Link to={`/${props.interfaceType}/group`}>
        <div
          className="tooltip tooltip-right w-6 h-6"
          data-tip="Accueil Interface de gestion des groupes"
        >
          <GroupIcon />
        </div>
      </Link>
    </li>
    <li>
      <Can action="write" object="group">
        <Link to={`/${props.interfaceType}/group/add`}>
          <div
            className="tooltip tooltip-right w-6 h-6"
            data-tip="Création d'un nouveau groupe"
          >
            <AddIcon />
          </div>
        </Link>
      </Can>
    </li>
  </ul>
);

export default Group;
