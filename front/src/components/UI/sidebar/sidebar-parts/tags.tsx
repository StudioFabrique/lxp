import { Link } from "react-router-dom";
import { Tag } from "lucide-react";

const Tags = ({ currentRoute }: { currentRoute: string[] }) => {
  const isCurrentPathActive = currentRoute[1] === "tags";

  return (
    <li>
      <Link
        to={`/${currentRoute[0]}/tags`}
        className="tooltip tooltip-right w-6 h-6 z-10"
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
    </li>
  );
};

export default Tags;
