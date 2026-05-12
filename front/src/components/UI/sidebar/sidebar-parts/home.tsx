import { Link } from "react-router";
import { HomeIcon } from "lucide-react";

const Home = ({ currentRoute }: { currentRoute: string[] }) => {
  const isCurrentPathActive = currentRoute[1] === undefined;

  return (
    <li>
      <Link to={`/${currentRoute[0]}`}>
        <div data-tip="Accueil LXP">
          <div className="flex gap-2 py-1 items-center">
            <span
              className={`p-2 rounded-lg hover:bg-primary/50 ${
                isCurrentPathActive && "bg-primary/50"
              }`}
            >
              <HomeIcon className="w-5 h-5" />
            </span>
            <span>Accueil</span>
          </div>
        </div>
      </Link>
    </li>
  );
};

export default Home;
