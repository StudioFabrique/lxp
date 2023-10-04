import { FC } from "react";

type Props = {
  children: React.ReactNode;
  loader: {
    lastTime: number;
    loadingRate: number;
  };
};
/**
 * Composant à utiliser avec le custom hook useProgressBar
 * Affiche une barre de progression en dessous du composant enfant
 * @param loader propriété loader du custom hook à passer
 * @returns
 */
const ProgressBarWrapper: FC<Props> = ({ children, loader }) => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-y-4 p-4 rounded-lg bg-secondary/20 h-full">
        {children}
      </div>
      <progress
        className="h-1 w-full progress progress-secondary -inset-y-1"
        value={loader.loadingRate}
        max={1.2}
      />
    </div>
  );
};

export default ProgressBarWrapper;
