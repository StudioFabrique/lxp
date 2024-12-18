import { Link } from "react-router-dom";
import { Library } from "lucide-react";

// Composant Mediatheque qui affiche un lien vers la médiathèque dans la sidebar
const Mediatheque = ({ currentRoute }: { currentRoute: string[] }) => {
  // Vérifie si la route actuelle correspond à la médiathèque
  const isCurrentPathActive = currentRoute[1] === undefined;

  return (
    <li>
      {/* Lien vers la page médiathèque */}
      <Link to={`/${currentRoute[0]}/mediatheque`}>
        {/* Tooltip qui apparaît au survol */}
        <div className="tooltip tooltip-right w-6 h-6" data-tip="Mediatheque">
          {/* Container pour l'icône et l'effet de survol */}
          <div className="flex hover justify-center items-center">
            {/* Icône de la médiathèque */}
            <Library className="z-10 pointer-events-none" />
            {/* Effet de survol et indication de la page active */}
            <span
              className={`absolute p-5 rounded-lg hover:bg-primary/50 ${
                isCurrentPathActive && "bg-primary/50"
              }`}
            />
          </div>
        </div>
      </Link>
    </li>
  );
};

export default Mediatheque;
