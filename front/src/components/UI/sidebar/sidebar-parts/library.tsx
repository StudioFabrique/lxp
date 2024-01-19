import { Link } from "react-router-dom";
import { LibraryBigIcon } from "lucide-react";

const Library = ({ interfaceType }: { interfaceType: string }) => (
  <li>
    <Link to={`/${interfaceType}`}>
      <div className="tooltip tooltip-right w-6 h-6" data-tip="Bibliothèque">
        <LibraryBigIcon />
      </div>
    </Link>
  </li>
);

export default Library;
