import { Link } from "react-router-dom";
import { LibraryBigIcon } from "lucide-react";

const Library = ({ currentRoute }: { currentRoute: string[] }) => {
  const isCurrentPathActive = currentRoute[1] === "library";

  return (
    <li>
      <Link to={`/${currentRoute[0]}/library`}>
        <div
          className={`tooltip tooltip-right w-6 h-6 ${
            isCurrentPathActive && "text-primary"
          }`}
          data-tip="Bibliothèque"
        >
          <div className="flex hover:text-primary text-primary-content justify-center items-center">
            <LibraryBigIcon className="z-10 pointer-events-none" />
            <span
              className={`absolute p-5 rounded-lg ${
                isCurrentPathActive && "bg-primary/50"
              }`}
            />
          </div>
        </div>
      </Link>
    </li>
  );
};

export default Library;
