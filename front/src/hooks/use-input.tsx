/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useReducer } from "react";

type Action = {
  value: string;
  type: string;
};

const inputStateReducer = (state: any, action: Action) => {
  switch (action.type) {
    case "INPUT":
      return { value: action.value, isTouched: state.isTouched };
    case "BLUR":
      return { value: action.value, isTouched: true };
    case "RESET":
      return { value: action.value, isTouched: false };
    case "IS_SUBMITTED":
      return { ...state, isTouched: true };
    case "NEW_PROPS":
      return { ...state, value: action.value };
    default:
      return;
  }
};

const useInput = (
  validateValue: (value: string) => boolean,
  initialValue: string = ""
) => {
  const [inputState, dispatch] = useReducer(inputStateReducer, {
    value: initialValue,
    isTouched: false,
  });

  const valueIsValid = validateValue(inputState!.value);
  const hasError = !valueIsValid && inputState!.isTouched;

  const valueChangeHandler = useCallback(
    (event: React.FormEvent<HTMLInputElement>) => {
      dispatch({ type: "INPUT", value: event.currentTarget.value });
    },
    []
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const valueBlurHandler = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (_event: React.FormEvent) => {
      dispatch({ type: "BLUR", value: inputState!.value });
    },
    [inputState]
  );

  const changeValue = (value: string) => {
    dispatch({ type: "INPUT", value: value });
  };

  const textAreaChangeHandler = useCallback(
    (event: React.FormEvent<HTMLTextAreaElement>) => {
      dispatch({ type: "INPUT", value: event.currentTarget.value });
    },
    []
  );

  const reset = useCallback(() => {
    dispatch({ type: "RESET", value: "" });
  }, []);

  const isSubmitted = useCallback(() => {
    dispatch({ type: "IS_SUBMITTED", value: "" });
  }, []);

  const newProps = useCallback((value: string) => {
    dispatch({ type: "NEW_PROPS", value });
  }, []);

  const datePicking = useCallback((value: string) => {
    dispatch({ type: "INPUT", value });
  }, []);

  return {
    value: {
      value: inputState!.value,
      hasError,
      isValid: valueIsValid,
      valueChangeHandler,
      changeValue,
      valueBlurHandler,
      reset,
      textAreaChangeHandler,
      isSubmitted,
      datePicking,
    },
    newProps,
  };
};

export default useInput;
