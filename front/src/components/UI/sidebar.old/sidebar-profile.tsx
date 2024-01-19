import { Link } from "react-router-dom";
import Can from "../can/can.component";
import UserIcon from "../svg/user-icon";
import EditIcon from "../svg/edit-icon";

const SidebarProfile = (props: { interfaceType: string }) => (
  <ul className="text-primary flex flex-col gap-y-4">
    <li>
      <Link
        to={`/${props.interfaceType}/profil`}
        state={{ tab: "Info", refreshId: Math.floor(Math.random() * 1000) }}
      >
        <div
          className="tooltip tooltip-right w-6 h-6"
          data-tip="Accueil Profile"
        >
          <UserIcon />
        </div>
      </Link>
    </li>
    <li>
      <Can action="update" object="profile">
        <Link
          to={`/${props.interfaceType}/profil`}
          state={{
            editMode: true,
            refreshId: Math.floor(Math.random() * 1000),
          }}
        >
          <div
            className="tooltip tooltip-right w-6 h-6"
            data-tip="Modifier mon profil"
          >
            <EditIcon />
          </div>
        </Link>
      </Can>
    </li>
  </ul>
);

export default SidebarProfile;
