import { Link } from "react-router-dom";
import { HomeIcon } from "lucide-react";

const Home = ({ currentRoute }: { currentRoute: string[] }) => {
  const isCurrentPathActive = currentRoute[1] === undefined;

  return (
    <li>
      <Link to={`/${currentRoute[0]}`}>
        <div
          className={`tooltip tooltip-right w-6 h-6 ${
            isCurrentPathActive && "text-primary"
          }`}
          data-tip="Accueil LXP"
        >
          <HomeIcon />
        </div>
      </Link>
    </li>
  );
};

export default Home;
