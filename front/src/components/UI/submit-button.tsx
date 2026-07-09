import { ReactNode } from "react";

interface SubmitButtonProps {
  children?: ReactNode;
  label: string;
  loadingLabel: string;
  isLoading: boolean;
  disabled?: boolean;
}

const SubmitButton = ({
  children,
  label,
  loadingLabel,
  isLoading,
  disabled = true,
}: SubmitButtonProps) => {
  return (
    <>
      {isLoading ? (
        <button className="btn btn-primary" disabled={isLoading}>
          <span className="loading loading-spinner"></span>
          <p className="flex-1">{loadingLabel}</p>
        </button>
      ) : (
        <button className="btn btn-primary" type="submit" disabled={!disabled}>
          {children ? <>{children}</> : null}

          {label}
        </button>
      )}
    </>
  );
};

export default SubmitButton;
