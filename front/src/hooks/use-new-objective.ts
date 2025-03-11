import { useEffect, useReducer, useRef } from "react";
import { regexGeneric } from "../utils/constantes";

// État initial du formulaire
type State = {
  toggleForm: boolean; // Contrôle l'affichage du formulaire
  newObjective: string; // Contient le texte de l'objectif
  error: string; // Message d'erreur éventuel
};

// Actions possibles pour modifier l'état
type Action =
  | { type: "TOGGLE_FORM" } // Basculer l'affichage du formulaire
  | { type: "SET_OBJECTIVE"; payload: string } // Mettre à jour le texte de l'objectif
  | { type: "SET_ERROR"; payload: string } // Définir un message d'erreur
  | { type: "RESET" }; // Réinitialiser le formulaire

// État initial
const initialState: State = {
  toggleForm: false,
  newObjective: "",
  error: "",
};

// Reducer pour gérer les modifications d'état
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "TOGGLE_FORM":
      return {
        ...state,
        toggleForm: !state.toggleForm,
      };
    case "SET_OBJECTIVE":
      return {
        ...state,
        newObjective: action.payload,
        error: "", // Réinitialise l'erreur lors de la modification
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

/**
 * Hook personnalisé pour gérer la création d'un nouvel objectif
 * @param onSubmit - Fonction appelée lors de la soumission du formulaire
 */
const useNewObjective = (onSubmit: (value: string) => void) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  // Scroll vers le formulaire quand il est affiché
  useEffect(() => {
    if (formRef.current && state.toggleForm) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [state.toggleForm]);

  // Gestion de la soumission du formulaire
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Vérifie si l'objectif n'est pas vide
    if (state.newObjective.trim() === "") {
      dispatch({
        type: "SET_ERROR",
        payload: "Le nom de l'objectif est requis",
      });
      return;
    }
    // Vérifie si l'objectif respecte le format attendu
    if (!regexGeneric.test(state.newObjective)) {
      dispatch({
        type: "SET_ERROR",
        payload: "Le nom de l'objectif est invalide",
      });
      return;
    }
    // Réinitialise le formulaire
    dispatch({ type: "RESET" });

    onSubmit(state.newObjective);
  };

  // Gestion de l'annulation
  const handleCancel = () => {
    document.getElementById("add-objective")?.click();
    dispatch({ type: "RESET" });
  };

  // Basculer l'affichage du formulaire
  const handleToggleForm = () => {
    dispatch({ type: "TOGGLE_FORM" });
  };

  // Mise à jour du texte de l'objectif
  const handleSetNewObjective = (value: string) => {
    dispatch({ type: "SET_OBJECTIVE", payload: value });
  };

  // Retourne les valeurs et fonctions nécessaires
  return {
    toggleForm: state.toggleForm,
    newObjective: state.newObjective,
    setNewObjective: handleSetNewObjective,
    handleSubmit,
    handleCancel,
    handleToggleForm,
    formRef,
  };
};

export default useNewObjective;
