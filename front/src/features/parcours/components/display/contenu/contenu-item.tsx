import { Dispatch, FC, SetStateAction, useMemo } from "react";
import Module from "../../../../../../src.legacy/utils/interfaces/module";
import { getMonth } from "../../../../../../src.legacy/utils/dates";
import { ArrowRightCircle } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { cn } from "../../../../../../src.legacy/utils";

const ContenuItem: FC<{
  module: Module;
  iterationCount: number;
  selectedModuleId: number | undefined;
  setSelectedModule: Dispatch<SetStateAction<Module | null>>;
}> = ({ module, iterationCount, selectedModuleId, setSelectedModule }) => {
  const minDate: { day: number | null; month: string } = useMemo(() => {
    if (!module.minDate) {
      return { day: null, month: "" };
    }
    const date = new Date(module.minDate);
    return {
      day: date.getDate(),
      month: getMonth(date.getMonth())?.substring(0, 3) ?? "",
    };
  }, [module.minDate]);

  const navigate = useNavigate();
  const isSelected = selectedModuleId === module.id;

  return (
    <div
      data-testid="contenu-item"
      className="flex gap-x-3 items-center group cursor-pointer"
      onClick={() => setSelectedModule(module)}
      onDoubleClick={() => navigate(`../module/${module.id}`)}
    >
      <div
        className={`flex flex-col items-center justify-center p-4 w-24 rounded-lg h-20 transition-colors ${
          isSelected
            ? "bg-secondary text-secondary-content"
            : "bg-base-100 text-base-content group-hover:bg-base-200"
        }`}
      >
        <p className="font-bold text-xl">{minDate.day}</p>
        <p className="font-bold uppercase text-sm opacity-80">
          {minDate.month}
        </p>
      </div>

      <div
        className={`flex h-20 items-center p-4 justify-between rounded-lg w-full transition-colors select-none ${
          isSelected
            ? "bg-primary text-primary-content shadow-md"
            : "bg-base-200 text-base-content group-hover:bg-base-300"
        }`}
      >
        <div>
          <p
            className={`text-sm opacity-80 ${isSelected ? "text-primary-content" : ""}`}
          >{`Module ${iterationCount}`}</p>
          <p className="text-base font-semibold">{module.title}</p>
        </div>
        <Link
          className={cn(
            "btn btn-sm btn-ghost self-end",
            isSelected ? "text-primary-content" : "",
          )}
          to={`../module/${module.id}`}
        >
          <ArrowRightCircle />
        </Link>
      </div>
    </div>
  );
};

export default ContenuItem;
