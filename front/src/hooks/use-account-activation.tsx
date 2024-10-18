/**
 *   Ce custom hook gère la logique de saisie d'un mot de passe
 *   et de sa confirmation. Il gère également la validité du lien
 *   d'activation du compte et la redirection automatique de
 *   l'utilisateur en cas d'activation réussie.
 */

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { regexPassword } from "../utils/constantes";
import useHttp from "./use-http";

type AccountActivation = {
  checkToken: () => void;
  error: string;
  handleChangeP1: (value: string) => void;
  handleChangeP2: (value: string) => void;
  handleSubmit: (event: React.FormEvent) => void;
  isValid: { p1: boolean; p2: boolean };
  password: string;
  password2: string;
  success: boolean;
  submitLoader: boolean;
};

export default function useAccountActivation(token: string): AccountActivation {
  const { error, sendRequest } = useHttp();
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [isValid, setIsValid] = useState<{ p1: boolean; p2: boolean }>({
    p1: true,
    p2: true,
  });
  const [success, setSuccess] = useState(false);
  const [submitLoader, setSubmitLoader] = useState(false);
  const nav = useNavigate();

  /**
   * Vérifie la validité du token contenu dans le lien d'activation
   */
  const checkToken = useCallback(() => {
    sendRequest({
      path: "/user/check-invitation",
      method: "post",
      body: { token },
    });
  }, [sendRequest, token]);

  /**
   * Soumet le nouveau mot de passe à l'API
   */
  const submitData = () => {
    setSubmitLoader(true);
    const applyData = (data: { success: boolean; message: string }) => {
      if (data.success) setSuccess(true);
      setSubmitLoader(false);
    };
    sendRequest(
      {
        path: "/user/activate",
        method: "post",
        body: {
          token,
          password,
        },
      },
      applyData,
    );
  };

  /**
   * Vérifie la validité des mots de passe saisis dans le formulaire
   * et qu'ils soient identiques.
   * @param event React.EventForm
   * @returns void
   */
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsValid({
      p1: regexPassword.test(password),
      p2: regexPassword.test(password2),
    });
    if (
      regexPassword.test(password) &&
      regexPassword.test(password2) &&
      password === password2
    )
      submitData();
    else return;
  };

  /**
   * Gère le changement de valeur du mot de passe
   * @param value string
   */
  const handleChangeP1 = (value: string) => {
    setIsValid({ ...isValid, p1: true });
    setPassword(value);
  };

  /**
   * Gère le changement de valeur du second mot de passe
   * @param value string
   */
  const handleChangeP2 = (value: string) => {
    setIsValid({ ...isValid, p2: true });
    setPassword2(value);
  };

  // Gère l'affichage des erreurs HTTP
  useEffect(() => {
    if (error.length > 0) {
      toast.error(error);
      setSubmitLoader(false);
    }
  }, [error]);

  // Gère la redirection automatique de l'utilisateur, supprime le setTimeOut qd le composant est démonté
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (success) {
      timer = setTimeout(() => {
        nav("/");
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [nav, success]);

  return {
    checkToken,
    error,
    handleChangeP1,
    handleChangeP2,
    isValid,
    handleSubmit,
    password,
    password2,
    success,
    submitLoader,
  };
}
