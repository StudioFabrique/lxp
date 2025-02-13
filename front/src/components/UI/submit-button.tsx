import { ReactNode } from "react";

interface SubmitButtonProps {
  children?: ReactNode;
  label: string;
  loadingLabel: string;
  isLoading: boolean;
  disabled: boolean;
}

const SubmitButton = (props: SubmitButtonProps) => {
  return (
    <>
      {props.isLoading ? (
        <button className="btn btn-primary" disabled={props.isLoading}>
          <span className="loading loading-spinner"></span>
          <p className="flex-1">{props.loadingLabel}</p>
        </button>
      ) : (
        <button
          className="btn btn-primary"
          type="submit"
          disabled={!props.disabled}
        >
          {props.children ? <>{props.children}</> : null}

          {props.label}
        </button>
      )}
    </>
  );
};

export default SubmitButton;
