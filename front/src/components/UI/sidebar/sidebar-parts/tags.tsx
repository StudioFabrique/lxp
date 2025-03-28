import { Link } from "react-router-dom";
import Can from "../../can/can.component";
import AddIcon from "../../svg/add-icon";
import { Tag } from "lucide-react";
import { useState } from "react";
import MotionSidebarWrapper from "./motion-sidebar-wrapper";

const Tags = ({ currentRoute }: { currentRoute: string[] }) => {
  const [isHover, setIsHover] = useState(false);
  const isCurrentPathActive = currentRoute[1] === "tags";

  return (
    <li
      onMouseOver={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div className="flex items-center">
        <Link
          to={`/${currentRoute[0]}/tags`}
          className="tooltip tooltip-top w-6 h-6 z-10"
          data-tip="Tags"
        >
          <div className="flex hover justify-center items-center">
            <Tag className="z-10 pointer-events-none" />
            <span
              className={`absolute p-5 rounded-lg hover:bg-primary/50 ${
                isCurrentPathActive && "bg-primary/50"
              }`}
            />
          </div>
        </Link>

        <MotionSidebarWrapper isHover={isHover}>
          <Can action="write" object="tag">
            <Link to={`/${currentRoute[0]}/tags/add`}>
              <div
                className="tooltip tooltip-top w-6 h-6"
                data-tip="Création d'un nouveau tag"
              >
                <AddIcon />
              </div>
            </Link>
          </Can>
        </MotionSidebarWrapper>
      </div>
    </li>
  );
};

export default Tags;
