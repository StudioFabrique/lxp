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
    <div className="alert alert-info mb-4 border-l-4 border-blue-500 bg-blue-50">
      <div className="flex items-center gap-3">
        <Save className="w-5 h-5 text-blue-600" />
        <div className="flex flex-col">
          {lastSaveTime && (
            <span className="text-xs text-blue-600 flex items-center gap-1 mt-1">
              <Clock className="w-3 h-3" />
              Dernière sauvegarde automatique :
              {lastSaveTime.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AutosaveIndicator;
