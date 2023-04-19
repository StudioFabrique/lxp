import { useReducer } from "react";

type Action = {
  value: string;
  type: string;
};

const initialInputState = {
  value: "",
  isTouched: false,
};

const inputStateReducer = (state: any, action: Action) => {
  switch (action.type) {
    case "INPUT":
      return { value: action.value, isTouched: state.isTouched };
    case "BLUR":
      return { value: action.value, isTouched: true };
    case "RESET":
      return { value: "", isTouched: false };
    default:
      return;
  }
};

const useInput = (validateValue: (value: string) => boolean) => {
  const [inputState, dispatch] = useReducer(
    inputStateReducer,
    initialInputState
  );

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

  const reset = () => {
    dispatch({ type: "RESET", value: inputState!.value });
  };

  const setValue = (data: string) => {
    dispatch({ type: "INPUT", value: data });
  };

  return {
    value: {
      value: inputState!.value,
      hasError,
      isValid: valueIsValid,
      valueChangeHandler,
      valueBlurHandler,
      reset,
      textAreaChangeHandler,
      setValue,
    },
  };
};

export default useInput;
