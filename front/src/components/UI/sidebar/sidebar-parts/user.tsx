import { UserIcon } from "lucide-react";
import { Link } from "react-router-dom";
import Can from "../../can/can.component";
import AddIcon from "../../svg/add-icon";

const User = (props: { interfaceType: string }) => (
  <ul className="text-primary flex flex-col gap-y-4">
    <li>
      <Link to={`/${props.interfaceType}/user`}>
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
        <Link to={`/${props.interfaceType}/user/add`}>
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

export default User;
