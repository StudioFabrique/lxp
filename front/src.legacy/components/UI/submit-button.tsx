import { ReactNode } from "react";

interface SubmitButtonProps {
  children?: ReactNode;
  label: string;
  loadingLabel: string;
  isLoading: boolean;
  disabled?: boolean;
}

/**
 * A button component used for form submissions with loading state support
 * @component
 * @param {object} props - The component props
 * @param {React.ReactNode} [props.children] - Optional child elements to render inside the button
 * @param {string} props.label - The text label to display on the button
 * @param {string} props.loadingLabel - The text to display while the button is in loading state
 * @param {boolean} props.isLoading - Whether the button is in a loading state
 * @param {boolean} [props.disabled=true] - Whether the button is disabled
 * @returns {JSX.Element} A styled submit button component that shows a loading spinner when isLoading is true
 */
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
