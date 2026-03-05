import { Dispatch, FC, SetStateAction, useMemo } from "react";
import Module from "../../../utils/interfaces/module";
import { getMonth } from "../../../utils/dates";
import { ArrowRightCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

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

  return (
    <div
      data-testid="contenu-item"
      className={`flex gap-x-2 items-center ${
        selectedModuleId === module.id ? "text-base-100" : "text-base-content"
      }`}
      onClick={() => setSelectedModule(module)}
      onDoubleClick={() => navigate(`../module/${module.id}`)}
    >
      <div className="flex flex-col items-center text-base-content justify-center bg-secondary p-4 w-24 rounded-lg h-20">
        <p className="font-bold text-xl">{minDate.day}</p>
        <p className="font-bold uppercase text-sm">{minDate.month}</p>
      </div>
      <div
        className={`flex h-20 items-center p-4 justify-between rounded-lg w-full ${
          selectedModuleId === module.id ? "bg-primary " : "bg-secondary"
        } hover:bg-primary/90 hover:cursor-pointer select-none `}
      >
        <div>
          <p className="self-start">{`Module ${iterationCount}`}</p>
          <p className="self-start text-sm font-semibold">{module.title}</p>
        </div>
        <Link
          className="btn btn-sm btn-ghost self-end"
          to={`../module/${module.id}`}
        >
          <ArrowRightCircle />
        </Link>
      </div>
    </div>
  );
};

export default ContenuItem;
