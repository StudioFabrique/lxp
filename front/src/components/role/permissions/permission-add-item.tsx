import { Shield, PlusCircle, HelpCircle } from "lucide-react";

type PermissionItemProps = {
  name: string;
  description: string;
  onAddPermission: (name: string) => void;
  onDeletePermission: (name: string) => void;
};

const PermissionAddItem = ({
  name,
  description,
  onAddPermission,
}: PermissionItemProps) => {
  const handleAddPermission = () => {
    onAddPermission(name);
  };

  return (
    <div className="flex items-center justify-between px-2 py-1 rounded-md bg-base-100 text-base-content gap-2 hover:bg-base-100/60 transition-colors duration-200 cursor-pointer">
      <div className="flex items-center gap-2">
        <Shield className="w-4 h-4 stroke-warning" />
        <p className="font-medium text-sm text-base-content capitalize">
          {name}
        </p>
        <div className="tooltip tooltip-right" data-tip={description}>
          <HelpCircle className="w-4 h-4 stroke-base-content/60" />
        </div>
      </div>
      <button
        onClick={handleAddPermission}
        className="p-1"
        aria-label="Add permission"
      >
        <PlusCircle className="w-4 stroke-success hover:stroke-success-content transition-all duration-200" />
      </button>
    </div>
  );
};

export default PermissionAddItem;
