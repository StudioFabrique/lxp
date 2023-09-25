import { Dispatch, FC, SetStateAction } from "react";
import Module from "../../../utils/interfaces/module";
import { getMonth } from "../../../utils/dates";
import RightArrowIcon from "../../UI/svg/right-arrow-icon";

const ParcoursViewContenuItem: FC<{
  module: Module;
  iterationCount: number;
  setSelectedModule: Dispatch<SetStateAction<Module>>;
}> = ({ module, iterationCount, setSelectedModule }) => {
  const minDate: { day: number; month: string } = {
    day: new Date(module.minDate!).getDay(),
    month: getMonth(new Date(module.minDate!).getMonth()),
  };

  return (
    <div
      className="flex gap-x-5 items-center"
      onClick={() => setSelectedModule(module)}
    >
      <div className="flex flex-col items-center bg-secondary p-4 w-20 rounded-lg">
        <p className="font-bold text-xl">{minDate.day}</p>
        <p className="uppercase">{minDate.month}</p>
      </div>
      <div className="flex flex-col items-center bg-primary-focus p-4 rounded-lg hover:bg-secondary-focus w-full">
        <p className="self-start">{`Module ${iterationCount}`}</p>
        <div className="flex justify-between w-full">
          <p className="self-start text-xl font-bold">{module.title}</p>
          <span className="self-end border-2 rounded-full">
            <RightArrowIcon />
          </span>
        </div>
      </div>
    </div>
  );
};

export default ParcoursViewContenuItem;
