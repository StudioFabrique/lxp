import { Link } from "react-router-dom";

import { UserCheck } from "lucide-react";
import Can from "../../can/can.component";

const Roles = ({ currentRoute }: { currentRoute: string[] }) => {
  const isCurrentPathActive = currentRoute[1] === "roles";

  return (
    <Can action="write" object="role">
      <li>
        <div className="flex items-center">
          <Can action="read" object="user">
            <Link
              to={`/${currentRoute[0]}/roles`}
              className="tooltip w-6 h-6 z-10"
              data-tip="Roles et permissions"
            >
              <div className="flex hover justify-center items-center">
                <UserCheck />
                <span
                  className={`absolute p-5 rounded-lg hover:bg-primary/50 ${
                    isCurrentPathActive && "bg-primary/50"
                  }`}
                />
              </div>
            </Link>
          </Can>
        </div>
      </li>
    </Can>
  );
};

export default Roles;
