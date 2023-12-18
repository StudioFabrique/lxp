import { Link } from "react-router-dom";
import Can from "../can/can.component";
import AddIcon from "../svg/add-icon";
import UserIcon from "../svg/user-icon";

const SidebarUser = () => (
  <ul className="text-primary flex flex-col gap-y-4">
    <li>
      <Link to="/admin/user">
        <div
          className="tooltip tooltip-right w-6 h-6"
          data-tip="Accueil Interface de gestion des utilisateurs"
        >
          <UserIcon />
        </div>
      </Link>
    </li>
    <li>
      <Can action="write" object="user">
        <Link to="/admin/user/add">
          <div
            className="tooltip tooltip-right w-6 h-6"
            data-tip="Création d'un nouveau utilisateur"
          >
            <AddIcon />
          </div>
        </Link>
      </Can>
    </li>
  </ul>
);

export default SidebarUser;
