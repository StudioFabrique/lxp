import { PropsWithChildren, useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Confetti from "react-confetti";
import toast from "react-hot-toast";
import { PartyPopperIcon } from "lucide-react";

import { AuthContext } from "../../store/AuthProvider";
import { toTitleCase } from "../../utils/helpers/text-helpers";

const ConfettiWrapper = ({ children }: PropsWithChildren) => {
  const { user, socket } = useContext(AuthContext);
  const [showConfetti, setShowConfetti] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Initialisation pour le portail
  useEffect(() => {
    setMounted(true);
  }, []);

  // Gestion des félicitations en temps réel via websocket
  useEffect(() => {
    function congratulateUser({
      studentMdbIdToFelicitate,
      nameFrom,
    }: {
      studentMdbIdToFelicitate: string;
      nameFrom: string;
    }) {
      if (user && studentMdbIdToFelicitate === user._id) {
        toast(`Vous avez été félicité par ${toTitleCase(nameFrom)} !`, {
          icon: <PartyPopperIcon />,
        });
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 4000);
      }
    }

    if (!socket) return;
    socket.on("send-accomplishment", congratulateUser);

    return () => {
      socket.off("send-accomplishment", congratulateUser);
    };
  }, [socket, user]);

  // Rendu du portail
  const portalContainer =
    typeof document !== "undefined" ? document.querySelector("#portal") : null;

  return (
    <>
      {showConfetti &&
        mounted &&
        portalContainer &&
        createPortal(
          <div className="fixed -z-10 top-0 left-0 w-screen h-screen">
            <Confetti className="fixed" />
          </div>,
          portalContainer,
        )}
      {children}
    </>
  );
};

export default ConfettiWrapper;
