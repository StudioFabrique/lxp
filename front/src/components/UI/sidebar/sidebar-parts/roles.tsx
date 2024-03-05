import { Link } from "react-router-dom";

import { UserCheck } from "lucide-react";

const Roles = ({ currentRoute }: { currentRoute: string[] }) => {
  const isCurrentPathActive = currentRoute[1] === "group";

  return (
    <li>
      <div className="flex items-center">
        <Link
          to={`/${currentRoute[0]}/roles`}
          className="tooltip tooltip-right w-6 h-6 z-10"
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
      </div>
    </li>
  );
};

export default Roles;
