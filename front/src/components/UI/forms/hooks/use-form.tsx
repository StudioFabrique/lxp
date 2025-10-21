/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import CustomError from "../../../../utils/interfaces/custom-error";
import { ZodError } from "zod";

/**
 * Hook personnalisé pour gérer les formulaires
 * @param data - Données initiales du formulaire (optionnel)
 * @returns Un objet contenant les valeurs, erreurs et fonctions de gestion du formulaire
 */
const useForm = (data = {}, schema?: any) => {
  console.log({ schema });

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
      console.log("toutes les erreurs ", errors);
      if (errors.length > 0)
        setErrors((prevErrors) => [
          ...prevErrors.filter((e: CustomError) => e.type !== field),
        ]);
      setValues((prevValues) => ({
        ...prevValues,
        [field]: value,
      }));
      if (schema) {
        console.log("schéma trouvé");

        try {
          schema.shape[field].parse(value);
        } catch (error) {
          if (error instanceof ZodError) {
            console.log("bla bla bvla");

            setErrors((prevErrors) => [
              ...prevErrors,
              { type: field, message: error.errors[0].message },
            ]);
            console.log({ errors });
          }
        }
      }
    },
    [errors, schema]
  );

  /**
   * Met à jour les erreurs de validation
   */
  const onValidationErrors = useCallback((data: CustomError[]) => {
    setErrors(data);
  }, []);

  const validationErrors = (error: any) => {
    console.log(error);

    let validationErrors = Array<CustomError>();
    for (const item of error.issues) {
      const customError: CustomError = {
        type: item.path[0] as string,
        message: item.message,
      };
      validationErrors = [...validationErrors, customError];
    }

    return validationErrors;
  };

  const onValidateForm = useCallback(() => {
    if (schema) {
      try {
        schema.parse(values);
        setErrors([]);
        return true;
      } catch (error) {
        if (error instanceof ZodError) {
          console.error({ error });
          const errors = validationErrors(error);
          onValidationErrors(errors);
          return false;
        }
        setErrors([]);
        return false;
      }
    }
  }, [schema, values, onValidationErrors]);

  /**
   * Réinitialise le formulaire (valeurs et erreurs)
   */
  const onResetForm = useCallback(() => {
    setValues({});
    setErrors([]);
  }, []);

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
    onValidateForm,
  };
};

export default useForm;
