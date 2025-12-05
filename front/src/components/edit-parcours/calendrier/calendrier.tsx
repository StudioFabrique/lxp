/* eslint-disable @typescript-eslint/no-explicit-any */

import "react-big-calendar/lib/css/react-big-calendar.css";
import { useSelector } from "react-redux";
import Module from "../../../utils/interfaces/module";
import { useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { parcoursModulesSliceActions } from "../../../store/redux-toolkit/parcours/parcours-modules";
import Calendar from "../../UI/calendar/calendar";
import { Context } from "../../../store/context.store";
import { TimelineEvent } from "../../UI/calendar/calendar-configuration";

const Calendrier = () => {
  const { theme } = useContext(Context);
  const darkMode = theme === "dark";

  const currentDate = new Date();

  const dispatch = useDispatch();

  const parcoursInfos = useSelector(
    (state: any) => state.parcoursInformations.infos
  );
  const modules: Module[] = useSelector(
    (state: any) => state.parcoursModules.modules
  );
  const currentModule = useSelector(
    (state: any) => state.parcoursModules.currentModule
  );

  const datesParcours = {
    startDate: parcoursInfos?.startDate
      ? new Date(parcoursInfos.startDate)
      : new Date(),
    endDate: parcoursInfos?.endDate
      ? new Date(parcoursInfos.endDate)
      : new Date(),
  };

  const modulesTimelineEvents: TimelineEvent[] = modules.map((mod) => ({
    id: mod.id!,
    title: mod.title,
    startDate: mod.minDate ? new Date(mod.minDate) : undefined,
    endDate: mod.maxDate ? new Date(mod.maxDate) : undefined,
    image: mod.thumb && `data:image/jpeg;base64,${mod.thumb}`,
  }));

  useEffect(() => {
    if (!modules || modules.length === 0) return;

    dispatch(
      parcoursModulesSliceActions.updateCurrentParcoursModule(
        !currentModule ? modules[0].id : currentModule.id
      )
    );
  }, [dispatch, currentModule, modules]);

  useEffect(() => {
    return () => {
      dispatch(parcoursModulesSliceActions.setCurrentModule(null));
    };
  }, [dispatch]);

  if (!modules || !parcoursInfos) {
    return (
      <div className="flex flex-col gap-y-5">
        <h1 className="text-2xl">Calendrier</h1>
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-5">
      <div className="flex gap-4 items-center justify-between">
        <h1 className="text-2xl">Dates des modules</h1>
        <span>
          {`Le parcours commence le ${datesParcours.startDate.toLocaleDateString()} et termine le
          ${datesParcours.endDate.toLocaleDateString()}`}
        </span>
      </div>
      {/* <ModulesListCalendrier modules={modules} /> */}
      <div className="col-span-2">
        <Calendar
          currentDate={currentDate}
          events={[]}
          startHour={8}
          endHour={18}
          view={"year-timeline"}
          timelineEvents={modulesTimelineEvents}
          darkMode={darkMode}
        />
      </div>
      {/* <div className="grid grid-cols-3 mt-4">
        <div />
        <div className="col-span-2 flex flex-col gap-4 bg-base-200 rounded-lg p-4">
          <CalendarDatesForm datesParcours={datesParcours} />
        </div>
      </div> */}
    </div>
  );
};

export default Calendrier;
