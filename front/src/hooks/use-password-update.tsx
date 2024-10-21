/**
 *   Ce custom hook gère la logique de saisie d'un mot de passe
 *   et de sa confirmation. Il gère également la validité du lien
 *   d'activation du compte et la redirection automatique de
 *   l'utilisateur en cas d'activation réussie.
 */

import { useCallback, useEffect, useReducer, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { regexPassword } from "../utils/constantes";
import useHttp from "./use-http";

type AccountActivation = {
  checkToken: () => void;
  error: string;
  handleChange: (field: "password" | "password2", value: string) => void;
  handleSubmit: (event: React.FormEvent) => void;
  isValid: { p1: boolean; p2: boolean };
  password: string;
  password2: string;
  success: boolean;
  submitLoader: boolean;
};

//  state utilisé avec useReducer
type State = {
  password: string;
  password2: string;
  isValid: { p1: boolean; p2: boolean };
};

//  actions utilisés pour le useReducer
type Action =
  | { type: "SET_PASSWORD"; payload: string }
  | { type: "SET_PASSWORD2"; payload: string }
  | { type: "VALIDATE_PASSWORDS"; payload: { p1: boolean; p2: boolean } };

//  initialisation du state pour le useReducer
const initialState: State = {
  password: "",
  password2: "",
  isValid: { p1: true, p2: true },
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_PASSWORD":
      return {
        ...state,
        password: action.payload,
        isValid: { ...state.isValid, p1: true },
      };
    case "SET_PASSWORD2":
      return {
        ...state,
        password2: action.payload,
        isValid: { ...state.isValid, p2: true },
      };
    case "VALIDATE_PASSWORDS":
      return { ...state, isValid: action.payload };
    default:
      return state;
  }
};

export default function useAccountActivation(token: string): AccountActivation {
  const { error, sendRequest } = useHttp();

  const [success, setSuccess] = useState(false);
  const [submitLoader, setSubmitLoader] = useState(false);
  const nav = useNavigate();

  const [state, dispatch] = useReducer(reducer, initialState);

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
  const submitData = useCallback(() => {
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
          password: state.password,
        },
      },
      applyData,
    );
  }, [state.password, sendRequest, token]);

  /**
   * Vérifie la validité des mots de passe saisis dans le formulaire
   * et qu'ils soient identiques.
   * @param event React.EventForm
   * @returns void
   */
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const validPassword = regexPassword.test(state.password);
    const validPassword2 = regexPassword.test(state.password2);
    dispatch({
      type: "VALIDATE_PASSWORDS",
      payload: { p1: validPassword, p2: validPassword2 },
    });

    if (validPassword && validPassword2 && state.password === state.password2) {
      submitData();
    }
  };

  /**
   * Gère le changement de valeur des mots de passe
   * @param field "password" | "password2" value string
   */
  const handleChange = (field: "password" | "password2", value: string) => {
    if (field === "password") {
      dispatch({ type: "SET_PASSWORD", payload: value });
    } else {
      dispatch({ type: "SET_PASSWORD2", payload: value });
    }
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
      }, 3500);
    }
    return () => clearTimeout(timer);
  }, [nav, success]);

  return {
    checkToken,
    error,
    handleChange,
    handleSubmit,
    isValid: state.isValid,
    password: state.password,
    password2: state.password2,
    success,
    submitLoader,
  };
}
