import { Link } from "react-router-dom";
import { MessageCircleIcon } from "lucide-react";

const Forum = ({ currentRoute }: { currentRoute: string[] }) => {
  const isCurrentPathActive = currentRoute[1] === "forum";

  return (
    <li>
      <Link to={`/${currentRoute[0]}/forum`}>
        <div
          className={`tooltip tooltip-right w-6 h-6 ${
            isCurrentPathActive && "text-primary"
          }`}
          data-tip="Forum"
        >
          <MessageCircleIcon />
        </div>
      </Link>
    </li>
  );
};

export default Forum;
