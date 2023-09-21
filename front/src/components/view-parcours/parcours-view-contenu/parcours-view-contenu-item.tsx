import { FC } from "react";
import Module from "../../../utils/interfaces/module";
import { getMonth } from "../../../utils/dates";
import RightArrowIcon from "../../UI/svg/right-arrow-icon";

const ParcoursViewContenuItem: FC<{
  module: Module;
  iterationCount: number;
}> = ({ module, iterationCount }) => {
  const minDate: { day: number; month: string } = {
    day: new Date(module.minDate!).getDay(),
    month: getMonth(new Date(module.minDate!).getMonth()),
  };

  return (
    <div className="flex gap-x-5">
      <div className="flex flex-col items-center bg-secondary p-4 w-20 h-20 rounded-lg">
        <p className="font-bold text-xl">{minDate.day}</p>
        <p className="uppercase">{minDate.month}</p>
      </div>
      <div className="flex flex-col items-center bg-primary-focus p-4 rounded-lg hover:bg-secondary-focus w-full">
        <p className="self-start">{`Module ${iterationCount}`}</p>
        <div className="flex justify-between w-full">
          <p className="self-start">{module.title}</p>
          <span className="self-end">
            <RightArrowIcon />
          </span>
        </div>
      </div>
    </div>
  );
};

export default ParcoursViewContenuItem;
