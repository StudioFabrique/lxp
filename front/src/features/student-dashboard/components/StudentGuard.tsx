import { useContext, useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { PartyPopperIcon } from "lucide-react";

// Importez vos dépendances depuis vos dossiers feature ou utils
import toTitleCase from "../../../utils/toTitleCase";
import { Context } from "../../../../old.src-arch/store/context.store";
import Loader from "../../../components/loaders/Loader";
import PortalConfetti from "../../../../old.src-arch/components/UI/portal/portal-confetti";

type Props = {
  children: ReactNode;
  requiredRole?: string;
};

const StudentGuard = ({ children, requiredRole = "student" }: Props) => {
  const { user, socket } = useContext(Context);
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);

  // 1. Logique d'authentification (Guard)
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    // Optionnel : vérification du rôle
    if (requiredRole && !user.roles.some((r) => r.role === requiredRole)) {
      navigate("/"); // Ou redirection vers dashboard général
    }
  }, [user, navigate, requiredRole]);

  // Logique des WebSockets (Félicitations)
  useEffect(() => {
    if (!socket || !user) return;

    function congratulateUser({
      studentMdbIdToFelicitate,
      nameFrom,
    }: {
      studentMdbIdToFelicitate: string;
      nameFrom: string;
    }) {
      if (studentMdbIdToFelicitate === user?._id) {
        toast(`Vous avez été félicité par ${toTitleCase(nameFrom)} !`, {
          icon: <PartyPopperIcon />,
        });
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 4000);
      }
    }

    socket.on("send-accomplishment", congratulateUser);

    return () => {
      socket.off("send-accomplishment", congratulateUser);
    };
  }, [socket, user]);

  // État de chargement si l'auth est en cours
  if (!user) return <Loader />;

  return (
    <>
      {showConfetti && <PortalConfetti />}
      {children}
    </>
  );
};

export default StudentGuard;
