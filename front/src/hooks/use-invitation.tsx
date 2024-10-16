/**
Custom hook qui gère l'envoi d'invitation pour l'activation
des comptes des nouveaux utilisateurs.
Ce hook est utilisé dans la vue qui affiche la liste des utilisateurs
et gère les évènements activés par les boutons "inviter".
Il gère également l'envoi de masse d'emails d'activation via le menu dropdown.
*/

import toast from "react-hot-toast";
import useHttp from "./use-http";
import { useEffect } from "react";

const useInvitation = () => {
  const { sendRequest, error, isLoading } = useHttp();

  const sendInvitation = (userId: string) => {
    const applyData = (data: { success: boolean; message: string }) => {
      if (data.success) toast.success(data.message);
    };
    sendRequest(
      { path: `/user/invitation/${userId}`, method: "put" },
      applyData,
    );
  };

  useEffect(() => {
    if (error.length > 0) toast.error(error);
  }, [error]);

  return { sendInvitation };
};

export default useInvitation;
