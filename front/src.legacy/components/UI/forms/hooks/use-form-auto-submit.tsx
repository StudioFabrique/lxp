/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import CustomError from "../../../../utils/interfaces/custom-error";

const useFormAutoSubmit = (data = {}) => {
  const [values, setValues] = useState<Record<string, string>>(data);
  const [errors, setErrors] = useState<CustomError[]>([]);
  const [submit, setSubmit] = useState<boolean>(false);

  //console.log("values from hook ", data);

  const onChangeValue = (field: string, value: string) => {
    if (errors && errors.length > 0) {
      setErrors((prevErrors) =>
        prevErrors.filter((error: CustomError) => error.type !== field)
      );
    }
    if (!submit) {
      setSubmit(true);
    }
    setValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
  };

  const onValidationErrors = (data: CustomError[]) => {
    setErrors(data);
  };

  const onResetForm = () => {
    setValues({});
    setErrors([]);
  };

  const initValues = useCallback((data: any) => {
    setValues(data);
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

  useEffect(() => {
    setValues({});
    setErrors([]);
  }, []);

  return {
    submit,
    values,
    errors,
    onValidationErrors,
    onChangeValue,
    onResetForm,
    initValues,
    setSubmit,
  };
};

export default useFormAutoSubmit;
