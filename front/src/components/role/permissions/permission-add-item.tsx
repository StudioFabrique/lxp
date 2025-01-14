import { Shield, PlusCircle, HelpCircle, User } from "lucide-react";

type PermissionItemProps = {
  name: string;
  description?: string;
  fullName: string;
  isRole?: boolean;
  inactive?: boolean;
  onAddPermission?: (name: string) => void;
};

const PermissionAddItem = ({
  name,
  description,
  fullName,
  isRole,
  inactive,
  onAddPermission,
}: PermissionItemProps) => {
  const handleAddPermission = () => {
    onAddPermission && onAddPermission(fullName);
  };

  return (
    <div
      className={`flex items-center justify-between px-2 py-1 rounded-md bg-base-100 text-base-content gap-2 transition-colors duration-200 h-8 ${
        inactive
          ? "bg-base-200/90 cursor-not-allowed border border-base-300"
          : "hover:bg-base-100/60 cursor-pointer"
      }`}
    >
      <div className="flex items-center gap-2">
        {isRole ? (
          <User
            className={`w-4 h-4 ${inactive ? "stroke-base-content/60" : "stroke-info"}`}
          />
        ) : (
          <Shield
            className={`w-4 h-4 ${inactive ? "stroke-base-content/60" : "stroke-warning"}`}
          />
        )}
        <p
          className={`font-medium text-sm capitalize ${inactive ? "text-base-content/60" : "text-base-content"}`}
        >
          {name}
        </p>
        <div className="tooltip tooltip-right" data-tip={description}>
          <HelpCircle
            className={`w-4 h-4 ${inactive ? "stroke-base-content/60" : "stroke-base-content/60"}`}
          />
        </div>
      </div>
      <button
        onClick={handleAddPermission}
        className="p-1"
        aria-label="Add permission"
      >
        <PlusCircle
          className={`w-4 stroke-success hover:stroke-success-content transition-all duration-200 ${inactive ? "invisible" : ""}`}
        />
      </button>
    </div>
  );
};

export default PermissionAddItem;
