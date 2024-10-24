/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * MADE IN MARTIN
 */

import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useSelector } from "react-redux";
import Module from "../../../utils/interfaces/module";
import ModulesListCalendrier from "./modules-list-calendrier";
import moment from "moment";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { parcoursModulesSliceActions } from "../../../store/redux-toolkit/parcours/parcours-modules";
import CalendarDatesForm from "./forms/calendar-dates-form";
import CalendarDurationForm from "./forms/calendar-duration-form";

const localizer = momentLocalizer(moment);

const Calendrier = () => {
  const dispatch = useDispatch();

  const parcoursInfos = useSelector(
    (state: any) => state.parcoursInformations.infos,
  );
  const modules: Module[] = useSelector(
    (state: any) => state.parcoursModules.modules,
  );
  const currentModule = useSelector(
    (state: any) => state.parcoursModules.currentModule,
  );

  const datesParcours = {
    startDate: new Date(parcoursInfos.startDate),
    endDate: new Date(parcoursInfos.endDate),
  };

  useEffect(() => {
    dispatch(
      parcoursModulesSliceActions.updateCurrentParcoursModule(
        !currentModule ? modules[0].id : currentModule.id,
      ),
    );
  }, [dispatch, currentModule, modules]);

  useEffect(() => {
    return () => {
      dispatch(parcoursModulesSliceActions.setCurrentModule(null));
    };
  }, [dispatch]);

  return (
    <div className="flex flex-col gap-y-5">
      <h1 className="text-2xl">Calendrier</h1>
      <p className="text-sm text-slate-400 pl-2">
        {`Dates du parcours : ${datesParcours.startDate.toLocaleDateString("fr-FR")} au ${datesParcours.endDate.toLocaleDateString("fr-FR")}`}
      </p>
      <div className="grid grid-cols-3 gap-x-5 min-h-[60vh]">
        <ModulesListCalendrier modules={modules} />
        <Calendar
          className="col-span-2 bg-white rounded-lg p-5"
          localizer={localizer}
          events={modules.map((module) => {
            return {
              start: new Date(module.minDate!).toISOString(),
              end: new Date(module.maxDate!).toISOString(),
              title: module.title,
              // color: getRandomHexColor(),
            };
          })}
          onDoubleClickEvent={(event) =>
            dispatch(
              parcoursModulesSliceActions.updateCurrentParcoursModule(
                modules.filter((module) => module.title === event.title)[0].id,
              ),
            )
          }
        />
      </div>
      <div className="grid grid-cols-3 max-md:grid-cols-1 max-md:gap-y-5 gap-x-5">
        <div />
        <CalendarDatesForm datesParcours={datesParcours} />
        <CalendarDurationForm />
      </div>
    </div>
  );
};

export default Calendrier;
