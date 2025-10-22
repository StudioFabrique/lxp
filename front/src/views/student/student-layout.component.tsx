// Import des dépendances nécessaires
import { useContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

// Import des composants et utilitaires personnalisés
import FadeWrapper from "../../components/UI/fade-wrapper/fade-wrapper";
import toast from "react-hot-toast";
import { PartyPopperIcon } from "lucide-react";
import toTitleCase from "../../utils/toTitleCase";
import PortalConfetti from "../../components/UI/portal/portal-confetti";
import useAuth from "../../hooks/use-auth";
import { Context } from "../../store/context.store";

// Composant de mise en page pour l'espace étudiant
const StudentLayout = () => {
  // Récupération du contexte et initialisation des états
  const { user, socket } = useContext(Context);
  const [showConfetti, setShowConfetti] = useState(false);

  // Protection de la route avec le hook d'authentification
  useAuth("student");

  // Gestion des félicitations en temps réel via websocket
  useEffect(() => {
    // Fonction appelée lorsqu'un étudiant reçoit des félicitations
    function congratulateUser({
      studentMdbIdToFelicitate,
      nameFrom,
    }: {
      studentMdbIdToFelicitate: string;
      nameFrom: string;
    }) {
      // Vérification que l'utilisateur est le destinataire
      if (user && studentMdbIdToFelicitate === user._id) {
        // Affichage de la notification
        toast(`Vous avez été félicité par ${toTitleCase(nameFrom)} !`, {
          icon: <PartyPopperIcon />,
        });
        // Déclenchement de l'animation de confettis
        setShowConfetti(true);
      }

      // Masquage des confettis après 4 secondes
      setTimeout(() => setShowConfetti(false), 4000);
    }

    // Si pas de socket, on ne fait rien
    if (!socket) return;

    // Abonnement à l'événement de félicitations
    socket.on("send-accomplishment", congratulateUser);

    // Nettoyage à la destruction du composant
    return () => {
      socket.off("send-accomplishment", congratulateUser);
    };
  }, [socket, user]);

  return (
    <div className="w-full">
      {/* Affichage conditionnel basé sur le rang de l'utilisateur */}
      {user && user.roles[0].rank > 2 ? (
        <div>
          {/* Animation de confettis conditionnelle */}
          {showConfetti && <PortalConfetti />}
          <FadeWrapper>
            <div className="w-full flex flex-col">
              <Outlet />
            </div>
          </FadeWrapper>
        </div>
      ) : null}
    </div>
  );
};

export default StudentLayout;
