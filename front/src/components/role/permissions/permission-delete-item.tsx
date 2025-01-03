import { Shield, MinusCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";

type PermissionItemProps = {
  name: string;
  description?: string;
  onDeleteItem: (name: string) => void;
};

const PermissionDeleteItem = ({
  name,
  description,
  onDeleteItem,
}: PermissionItemProps) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const confirmRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        confirmRef.current &&
        !confirmRef.current.contains(event.target as Node)
      ) {
        setShowConfirm(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClick = () => {
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    onDeleteItem(name);
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  return (
    <div className="group relative flex items-center justify-between px-2 py-1 rounded-md bg-base-100 text-base-content gap-2 hover:bg-base-100/60 transition-colors duration-200 cursor-pointer">
      <div className="flex items-center gap-1">
        <Shield className="w-4 h-4 stroke-warning" />
        <p className="font-medium text-sm text-base-content capitalize">
          {name}
        </p>
      </div>
      {description && !showConfirm && (
        <div className="z-10 absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 top-full mt-2 left-0 bg-neutral text-neutral-content px-3 py-2 rounded text-sm whitespace-normal shadow-lg w-64">
          {description}
        </div>
      )}
      <div className="relative">
        <button
          onClick={handleClick}
          className="p-1"
          aria-label="Delete permission"
        >
          <MinusCircle className="w-4 stroke-error hover:stroke-error-content transition-all duration-200" />
        </button>

        {showConfirm && (
          <div
            ref={confirmRef}
            className="absolute z-20 bottom-full mb-2 bg-base-200 rounded-lg shadow-lg p-3 w-48 border border-base-300"
          >
            <p className="text-sm mb-3">Supprimer la permission "{name}" ?</p>
            <div className="flex justify-end gap-2">
              <button onClick={handleCancel} className="btn btn-ghost btn-xs">
                Annuler
              </button>
              <button
                onClick={handleConfirm}
                className="btn btn-error btn-xs text-error-content"
              >
                Supprimer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PermissionDeleteItem;
