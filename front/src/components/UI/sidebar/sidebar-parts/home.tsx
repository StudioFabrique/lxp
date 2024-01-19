import { Link } from "react-router-dom";
import { HomeIcon } from "lucide-react";

const Home = ({ interfaceType }: { interfaceType: string }) => (
  <li>
    <Link to={`/${interfaceType}`}>
      <div className="tooltip tooltip-right w-6 h-6" data-tip="Accueil LXP">
        <HomeIcon />
      </div>
    </Link>
  </li>
);

export default Home;
