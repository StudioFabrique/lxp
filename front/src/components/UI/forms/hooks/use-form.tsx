/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import CustomError from "../../../../utils/interfaces/custom-error";

/**
 * Hook personnalisé pour gérer les formulaires
 * @param data - Données initiales du formulaire (optionnel)
 * @returns Un objet contenant les valeurs, erreurs et fonctions de gestion du formulaire
 */
const useForm = (data = {}) => {
  // État pour stocker les valeurs des champs du formulaire
  const [values, setValues] = useState<Record<string, string>>(data);
  // État pour stocker les erreurs de validation
  const [errors, setErrors] = useState<CustomError[]>([]);

  /**
   * Gère le changement de valeur d'un champ
   * Supprime l'erreur associée au champ si elle existe
   */
  const onChangeValue = useCallback(
    (field: string, value: string) => {
      if (errors && errors.length > 0) {
        setErrors((prevErrors) =>
          prevErrors.filter((error: CustomError) => error.type !== field)
        );
      }
      setValues((prevValues) => ({
        ...prevValues,
        [field]: value,
      }));
    },
    [errors]
  );

  /**
   * Met à jour les erreurs de validation
   */
  const onValidationErrors = (data: CustomError[]) => {
    setErrors(data);
  };

  /**
   * Réinitialise le formulaire (valeurs et erreurs)
   */
  const onResetForm = () => {
    setValues({});
    setErrors([]);
  };

  /**
   * Initialise les valeurs du formulaire
   */
  const initValues = useCallback((data: any) => {
    setValues(data);
  }, []);

  /**
   * Effet pour réinitialiser le formulaire au montage/démontage du composant
   */
  useEffect(() => {
    setValues({});
    setErrors([]);
    return () => {
      setValues({});
      setErrors([]);
    };
  }, []);

  /*useEffect(() => {
    if (hasBeenSubmitted) {
      setErrors([]);
    }
  }, [hasBeenSubmitted, values]);*/

  /*   useEffect(() => {
    if (data !== undefined) {
      setValues(data);
    }
  }, [data]); */

  return {
    values,
    errors,
    onValidationErrors,
    onChangeValue,
    onResetForm,
    initValues,
  };
};

export default useForm;
