import { FC } from "react";

export const LoadingButton: FC<{
  isLoading: boolean;
  error: string;
  label: string;
  loadingLabel: string;
}> = (props) => {
  return (
    <>
      {props.isLoading && props.error.length === 0 ? (
        <button className="btn loading normal-case bg-pink-900 p-3 rounded-md pr-6 pl-6 text-white text-[8pt]">
          {props.loadingLabel}
        </button>
      ) : (
        <button className="btn normal-case bg-pink-900 p-3 rounded-md pr-6 pl-6 text-white text-[8pt]">
          {props.label}
        </button>
      )}
    </>
  );
};
