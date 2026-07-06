import { PropsWithChildren, useContext, useEffect, useState } from "react";

import toast from "react-hot-toast";
import { PartyPopperIcon } from "lucide-react";
import toTitleCase from "../../../utils/toTitleCase";
import { AuthContext } from "../../../store/AuthProvider";
import PortalConfetti from "./portal-confetti";

const ConfettiWrapper = ({ children }: PropsWithChildren) => {
  const { user, socket } = useContext(AuthContext);
  const [showConfetti, setShowConfetti] = useState(false);

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
    <>
      {/* Animation de confettis conditionnelle */}
      {showConfetti && <PortalConfetti />}
      {children}
    </>
  );
};

export default ConfettiWrapper;
