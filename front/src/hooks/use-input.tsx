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

  const valueChangeHandler = (event: React.FormEvent<HTMLInputElement>) => {
    dispatch({ type: "INPUT", value: event.currentTarget.value });
  };

  const valueBlurHandler = (_event: React.FormEvent) => {
    dispatch({ type: "BLUR", value: inputState!.value });
  };

  const textAreaChangeHandler = (
    event: React.FormEvent<HTMLTextAreaElement>
  ) => {
    dispatch({ type: "INPUT", value: event.currentTarget.value });
  };

  const reset = useCallback(() => {
    dispatch({ type: "RESET", value: "" });
  }, []);

  const isSubmitted = useCallback(() => {
    dispatch({ type: "IS_SUBMITTED", value: "" });
  }, []);

  return {
    value: {
      value: inputState!.value,
      hasError,
      isValid: valueIsValid,
      valueChangeHandler,
      valueBlurHandler,
      reset,
      textAreaChangeHandler,
      isSubmitted,
    },
  };
};

export default useInput;
