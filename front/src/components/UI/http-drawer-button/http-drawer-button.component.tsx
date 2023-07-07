import { FC } from "react";

type Props = {
  isLoading: boolean;
  error: string;
  resultOk: boolean;
};

const HttpDrawerButton: FC<Props> = ({ isLoading, error, resultOk }) => {
  let buttonStyle = "w-full btn btn-sm btn-primary";

  const setButtonStyle = () => {
    if (isLoading) {
      return (buttonStyle += " btn-outline");
    } else if (!isLoading && error.length > 0) {
      return (buttonStyle += " btn-outline");
    } else if (!isLoading && resultOk) {
      return (buttonStyle += " btn-outline");
    } else {
      return buttonStyle;
    }
  };

  return (
    <button className={setButtonStyle()} type="submit">
      {isLoading && (
        <span className="loading loading-spinner loading-sm"></span>
      )}
      {!isLoading && error.length > 0 && (
        <>
          <p>Téléverser</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 text-error"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </>
      )}
      {!isLoading && resultOk && (
        <>
          <p>Téléverser</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 text-success"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </>
      )}
      {!isLoading && error.length === 0 && !resultOk && <p>Téléverser</p>}
    </button>
  );
};

export default HttpDrawerButton;
