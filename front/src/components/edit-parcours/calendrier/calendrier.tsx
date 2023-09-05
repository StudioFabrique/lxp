/* import { Schedulely } from "schedulely";
import "schedulely/dist/index.css"; */
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useSelector } from "react-redux";
import Module from "../../../utils/interfaces/module";
import ModulesListCalendrier from "./modules-list-calendrier";
import CalendrierForm from "./calendrier-form";
import Wrapper from "../../UI/wrapper/wrapper.component";
import moment from "moment";
// import { getRandomHexColor } from "../../../utils/randomColor";

const localizer = momentLocalizer(moment);

const Calendrier = () => {
  const parcoursInfos = useSelector(
    (state: any) => state.parcoursInformations.infos
  );
  const modules: Module[] = useSelector(
    (state: any) => state.parcoursModules.modules
  );
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
          <div className="row-span-2 h-[60vh]">
            <Wrapper>
              <Calendar
                style={{ backgroundColor: "white" }}
                localizer={localizer}
                events={modules.map((module) => {
                  return {
                    start: new Date(module.minDate!).toISOString(),
                    end: new Date(module.maxDate!).toISOString(),
                    title: module.title,
                    // color: getRandomHexColor(),
                  };
                })}
              />
            </Wrapper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendrier;
