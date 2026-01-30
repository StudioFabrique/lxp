import { CheckCircle2 } from "lucide-react";
import { ReactNode } from "react";

type SelectableSubCardProps<T extends { id?: number | string; title: string }> =
  {
    data: T;
    icon: ReactNode;
    isSelected: boolean;
    onSelect: (data: T) => void;
  };

const SelectableSubCard = <T extends { id?: number | string; title: string }>({
  data,
  icon,
  isSelected,
  onSelect,
}: SelectableSubCardProps<T>) => {
  return (
    <div
      key={data.id}
      onClick={() => onSelect(data)}
      className={`card bg-base-100 shadow-sm border cursor-pointer transition-all duration-200 ${isSelected ? "border-secondary ring-1 ring-secondary bg-secondary/20" : "border-base-200 hover:border-secondary/50"}`}
    >
      <div className="card-body p-4 flex flex-row items-center gap-3">
        <div
          className={`p-2 rounded-full ${isSelected ? "bg-primary text-white" : "bg-base-200 text-base-content/50"}`}
        >
          {icon}
        </div>
        <span
          className={`font-medium text-sm ${isSelected ? "text-secondary-focus" : "text-base-content"}`}
        >
          {data.title}
        </span>
        {isSelected && (
          <CheckCircle2 size={16} className="text-primary ml-auto" />
        )}
      </div>
    </div>
  );
};

export default SelectableSubCard;
