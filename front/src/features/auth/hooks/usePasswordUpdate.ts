import { useCallback, useEffect, useReducer, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { passwordApi } from "../api/password.api";

const regexPassword =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[-!@#\$%\^&\*])(?=.{12,})/;

type State = {
  password: string;
  password2: string;
  isValid: { p1: boolean; p2: boolean };
};

type Action =
  | { type: "SET_PASSWORD"; payload: string }
  | { type: "SET_PASSWORD2"; payload: string }
  | { type: "VALIDATE_PASSWORDS"; payload: { p1: boolean; p2: boolean } };

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

export function usePasswordUpdate(token: string) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitLoader, setSubmitLoader] = useState(false);
  const nav = useNavigate();

  const [state, dispatch] = useReducer(reducer, initialState);

  const checkToken = useCallback(async () => {
    try {
      await passwordApi.checkInvitation(token);
    } catch {
      setError("Le lien d'activation n'est pas valide ou a expiré.");
    }
  }, [token]);

  const submitData = useCallback(async () => {
    setSubmitLoader(true);
    setError("");
    try {
      const data = await passwordApi.activateAccount(token, state.password);
      if (data.success) setSuccess(true);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Une erreur est survenue";
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitLoader(false);
    }
  }, [state.password, token]);

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

  const handleChange = (field: "password" | "password2", value: string) => {
    dispatch({
      type: field === "password" ? "SET_PASSWORD" : "SET_PASSWORD2",
      payload: value,
    });
  };

  useEffect(() => {
    if (error.length > 0) {
      toast.error(error);
      setSubmitLoader(false);
    }
  }, [error]);

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
