import { Link } from "react-router-dom";
import { MessageCircleIcon } from "lucide-react";

const Forum = ({ interfaceType }: { interfaceType: string }) => (
  <li>
    <Link to={`/${interfaceType}`}>
      <div className="tooltip tooltip-right w-6 h-6" data-tip="Forum">
        <MessageCircleIcon />
      </div>
    </Link>
  </li>
);

export default Forum;
