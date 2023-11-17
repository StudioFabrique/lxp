/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { createContext, useState, ReactNode, useEffect } from "react";
import CustomError from "../../../utils/interfaces/custom-error";

interface FormContextType {
  values: Record<string, string>;
  errors: any[];
  onValidationErrors: (data: any) => void;
  //onHasBeenSubmitted: (value: boolean) => void;
  onChangeValue: (field: string, value: string) => void;
  onResetForm: () => void;
}

export const FormContext = createContext<FormContextType>({
  values: {},
  errors: [{}],
  onValidationErrors: (_data: any) => {},
  //onHasBeenSubmitted: (_value: boolean) => {},
  onChangeValue: (_field: string, _value: string) => {},
  onResetForm: () => {},
});

export default function FormContextProvider(props: { children: ReactNode }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<any[]>([]);
  //const [hasBeenSubmitted, setHasBeenSubmitted] = useState(false);

  const onChangeValue = (field: string, value: string) => {
    console.log({ field, value });
    if (errors && errors.length > 0) {
      setErrors((prevErrors) =>
        prevErrors.filter((error: CustomError) => error.type !== field)
      );
    }
    setValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
  };

  const onValidationErrors = (data: any) => {
    setErrors(data);
  };

  const onResetForm = () => {
    let data = {};
    for (const property in Object) {
      data = { ...data, [property]: "" };
    }
    setValues(data);
    setErrors([]);
  };

  /*useEffect(() => {
    if (hasBeenSubmitted) {
      setErrors([]);
    }
  }, [hasBeenSubmitted, values]);*/

  useEffect(() => {
    setValues({});
    setErrors([]);
  }, []);

  const contextValue: FormContextType = {
    values,
    errors,
    onValidationErrors,
    //onHasBeenSubmitted,
    onChangeValue,
    onResetForm,
  };

  return (
    <FormContext.Provider value={contextValue}>
      {props.children}
    </FormContext.Provider>
  );
}
