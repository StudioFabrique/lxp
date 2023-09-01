import { FC, useEffect } from "react";
import Module from "../../../utils/interfaces/module";

const ModuleCalendrierPreview: FC<{
  module: Module;
  datesParcours: { startDate: Date; endDate: Date };
}> = ({ module, datesParcours }) => {
  const percentageRatioStart =
    new Date(module.minDate!).getTime() / datesParcours.endDate.getTime();

  const percentageRatioEnd =
    new Date(module.maxDate!).getTime() / datesParcours.startDate.getTime();

  useEffect(() => {
    console.log(percentageRatioStart);
    console.log(percentageRatioStart);
  }, []);

  return <span></span>;
};

export default ModuleCalendrierPreview;
