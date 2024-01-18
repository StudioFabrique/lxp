import { Dispatch, FC, SetStateAction } from "react";
import Module from "../../../utils/interfaces/module";
import { getMonth } from "../../../utils/dates";
import RightArrowRoundedIcon from "../../UI/svg/right-arrow-rounded-icon";

const ParcoursViewContenuItem: FC<{
  module: Module;
  iterationCount: number;
  setSelectedModule: Dispatch<SetStateAction<Module | null>>;
}> = ({ module, iterationCount, setSelectedModule }) => {
  console.log(module.minDate);

  const minDate: { day: number; month: string } = {
    day: new Date(module.minDate!).getDay(),
    month: getMonth(new Date(module.minDate!).getMonth()).substring(0, 4),
  };

  return (
    <div
      className="flex gap-x-4 items-center"
      onClick={() => setSelectedModule(module)}
    >
      <div className="flex flex-col items-center justify-center bg-primary/50 text-primary-content p-4 w-24 h-full rounded-lg">
        <p className="font-bold text-2xl">{minDate.day}</p>
        <p className="font-bold uppercase">{minDate.month}</p>
      </div>
      <div className="flex flex-col items-center p-4 rounded-lg w-full h-full bg-secondary hover:bg-primary hover:text-primary-content">
        <p className="self-start">{`Module ${iterationCount}`}</p>
        <div className="flex justify-between w-full">
          <p className="self-start text-xl font-semibold">{module.title}</p>
          <span className="self-end w-6">
            <RightArrowRoundedIcon />
          </span>
        </div>
      </div>
    </div>
  );
};

export default ParcoursViewContenuItem;