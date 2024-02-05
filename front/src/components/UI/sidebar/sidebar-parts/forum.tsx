import { Link } from "react-router-dom";
import { MessageCircleIcon } from "lucide-react";

const Forum = ({ currentRoute }: { currentRoute: string[] }) => (
  <li>
    <Link to={`/${currentRoute[0]}/forum`}>
      <div className="tooltip tooltip-right w-6 h-6" data-tip="Forum">
        <MessageCircleIcon />
      </div>
    </Link>
  </li>
);

export default Forum;
