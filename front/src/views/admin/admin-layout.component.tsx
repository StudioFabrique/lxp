// Import des dépendances nécessaires
import { Outlet } from "react-router-dom";

// Import des composants et hooks personnalisés
import FadeWrapper from "../../components/UI/fade-wrapper/fade-wrapper";
import useAuth from "../../hooks/use-auth";

// Composant de mise en page pour l'espace administrateur
const AdminLayout = () => {
  // Protection de la route avec le hook d'authentification
  //const { userRank } = useAuth("admin");

  return (
    // Conteneur principal
    <div className="w-full">
      {/* Wrapper pour l'animation de transition */}
      <FadeWrapper>
        {/* Zone de contenu avec marges */}
        <div className="w-full flex flex-col pl-24 pr-2 py-2">
          {/* Affichage des routes enfants */}
          <Outlet />
        </div>
      </FadeWrapper>
    </div>
  );
};

export default AdminLayout;
