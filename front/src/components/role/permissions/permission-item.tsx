import { Shield, MinusCircle } from "lucide-react";

type PermissionItemProps = {
  name: string;
  onDelete?: () => void;
};

const PermissionItem = ({ name, onDelete }: PermissionItemProps) => {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-base-100 text-base-content gap-2 hover:bg-base-200 transition-colors duration-200 cursor-pointer">
      <div className="flex items-center gap-2">
        <Shield className="w-5 h-5 stroke-warning" />
        <p className="font-medium text-base-content">{name}</p>
      </div>
      <button
        onClick={onDelete}
        className="p-2 hover:text-error-content transition-all duration-200"
        aria-label="Delete permission"
      >
        <MinusCircle className="w-5 stroke-error" />
      </button>
    </div>
  );
};

export default PermissionItem;
