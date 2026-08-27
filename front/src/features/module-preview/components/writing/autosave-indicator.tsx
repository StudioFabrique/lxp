import { Clock, Save } from "lucide-react";

type AutosaveIndicatorProps = {
  isVisible: boolean;
  lastSaveTime?: Date | null;
};

const AutosaveIndicator = ({
  isVisible,
  lastSaveTime,
}: AutosaveIndicatorProps) => {
  if (!isVisible) return null;

  return (
    <div className="flex items-center gap-3">
      <Save className="w-5 h-5 text-primary" />
      <div className="flex flex-col">
        {lastSaveTime && (
          <span className="text-xs text-primary flex items-center gap-1 mt-1">
            <span>Dernière sauvegarde automatique :</span>
            {lastSaveTime.toLocaleTimeString("fr")}
          </span>
        )}
      </div>
    </div>
  );
};

export default AutosaveIndicator;
