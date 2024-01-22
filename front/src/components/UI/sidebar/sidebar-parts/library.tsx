import { Link } from "react-router-dom";
import { LibraryBigIcon } from "lucide-react";

const Library = ({ currentRoute }: { currentRoute: string[] }) => (
  <li>
    <Link to={`/${currentRoute[0]}`}>
      <div className="tooltip tooltip-right w-6 h-6" data-tip="Bibliothèque">
        <LibraryBigIcon />
      </div>
    </Link>
  </li>
);

export default Library;
