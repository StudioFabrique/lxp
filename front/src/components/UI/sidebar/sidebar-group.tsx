import { Link } from "react-router-dom";
import GroupIcon from "../svg/group-icon";
import Can from "../can/can.component";
import AddIcon from "../svg/add-icon";

const SidebarGroup = () => (
  <ul className="text-primary flex flex-col gap-y-4">
    <li>
      <Link to="/admin/group">
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
        <Link to="/admin/group/add">
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

export default SidebarGroup;
