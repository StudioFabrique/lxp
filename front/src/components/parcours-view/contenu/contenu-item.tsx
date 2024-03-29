import { Dispatch, FC, SetStateAction } from "react";
import Module from "../../../utils/interfaces/module";
import { getMonth } from "../../../utils/dates";
import { ArrowRightCircle } from "lucide-react";
import { Link } from "react-router-dom";

const ContenuItem: FC<{
  module: Module;
  iterationCount: number;
  selectedModuleId: number | undefined;
  setSelectedModule: Dispatch<SetStateAction<Module | null>>;
}> = ({ module, iterationCount, selectedModuleId, setSelectedModule }) => {
  const minDate: { day: number; month: string } = {
    day: new Date(module.minDate!).getDay(),
    month: getMonth(new Date(module.minDate!).getMonth()).substring(0, 4),
  };

  return (
    <div
      className="flex gap-x-4 items-center"
      onClick={() => setSelectedModule(module)}
    >
      <div className="flex flex-col items-center justify-center bg-secondary text-secondary-content p-4 w-24 h-full rounded-lg">
        <p className="font-bold text-2xl">{minDate.day}</p>
        <p className="font-bold uppercase">{minDate.month}</p>
      </div>
      <div
        className={`flex flex-col items-center p-4 rounded-lg w-full h-full ${
          selectedModuleId === module.id
            ? "bg-primary text-primary-content"
            : "bg-secondary text-secondary-content"
        } hover:bg-primary/70 hover:text-primary-content`}
      >
        <p className="self-start">{`Module ${iterationCount}`}</p>
        <div className="flex justify-between w-full">
          <p className="self-start text-xl font-semibold">{module.title}</p>
          <Link className="self-end w-6" to={`../module/${module.id}`}>
            <ArrowRightCircle />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ContenuItem;
