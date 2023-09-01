import { useSelector } from "react-redux";
import Module from "../../../utils/interfaces/module";
import ModulesListCalendrier from "./modules-list-calendrier";
import CalendrierForm from "./calendrier-form";
import Wrapper from "../../UI/wrapper/wrapper.component";
import ModuleCalendrierPreview from "./module-calendrier-preview";

const Calendrier = () => {
  const parcoursInfos = useSelector(
    (state: any) => state.parcoursInformations.infos
  );
  const modules: Module[] = useSelector(
    (state: any) => state.parcoursModule.modules
  ) as Module[];
  const datesParcours = {
    startDate: new Date(parcoursInfos.startDate),
    endDate: new Date(parcoursInfos.endDate),
  };

  return (
    <div className="flex flex-col gap-y-5">
      <h1 className="text-2xl">Calendrier</h1>
      <div className="grid grid-cols-3 gap-x-5">
        <ModulesListCalendrier modules={modules} />
        <div className="grid grid-rows-3 gap-y-5 col-span-2">
          <CalendrierForm datesParcours={datesParcours} />
          <div className="row-span-2">
            <Wrapper>
              {modules.map((module) => (
                <ModuleCalendrierPreview
                  datesParcours={datesParcours}
                  module={module}
                />
              ))}
            </Wrapper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendrier;
