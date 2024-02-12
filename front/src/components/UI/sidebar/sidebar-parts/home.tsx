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
          <div className="flex hover:text-primary text-primary-content justify-center items-center">
            <HomeIcon className="z-10 pointer-events-none" />
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

export default Home;
