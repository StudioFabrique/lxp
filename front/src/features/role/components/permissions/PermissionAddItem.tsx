import { Shield, PlusCircle, User } from "lucide-react";
import QuestionMarkTooltip from "../../../../../src.legacy/components/UI/question-mark-tooltip/question-mark-tooltip";

type PermissionAddItemProps = {
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
}: PermissionAddItemProps) => {
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
        <QuestionMarkTooltip tooltipValue={description} />
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
