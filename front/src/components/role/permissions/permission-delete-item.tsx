import { Shield, MinusCircle } from "lucide-react";

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
  const handleClick = () => {
    onDeleteItem(name);
  };

  return (
    <div className="group relative flex items-center justify-between px-2 py-1 rounded-md bg-base-100 text-base-content gap-2 hover:bg-base-100/60 transition-colors duration-200 cursor-pointer">
      <div className="flex items-center gap-1">
        <Shield className="w-4 h-4 stroke-warning" />
        <p className="font-medium text-sm text-base-content capitalize">
          {name}
        </p>
      </div>
      {description && (
        <div className="z-10 absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 top-full mt-2 left-0 bg-neutral text-neutral-content px-3 py-2 rounded text-sm whitespace-normal shadow-lg w-64">
          {description}
        </div>
      )}
      <button
        onClick={handleClick}
        className="p-1"
        aria-label="Delete permission"
      >
        <MinusCircle className="w-4 stroke-error hover:stroke-error-content transition-all duration-200" />
      </button>
    </div>
  );
};

export default PermissionDeleteItem;
