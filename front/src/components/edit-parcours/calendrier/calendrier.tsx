/* eslint-disable @typescript-eslint/no-explicit-any */
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useSelector, useDispatch } from "react-redux";
import { useContext, useEffect, useState } from "react";
import Module from "../../../utils/interfaces/module";
import { parcoursModulesSliceActions } from "../../../store/redux-toolkit/parcours/parcours-modules";
import Calendar from "../../UI/calendar/calendar";
import { Context } from "../../../store/context.store";
import { TimelineEvent } from "../../UI/calendar/calendar-configuration";
import ModuleDateModal from "./module-date-modal";
import ModuleDetailsModal from "./module-details-modal";
import { formatDate } from "../../UI/calendar/calendar-utils";

const Calendrier = () => {
  const { theme } = useContext(Context);
  const darkMode = theme === "dark";
  const currentDate = new Date();
  const dispatch = useDispatch();

  // STATE TO TRACK WHICH MODAL IS OPEN
  const [activeModal, setActiveModal] = useState<"edit" | "details" | null>(
    null
  );

  const parcoursInfos = useSelector(
    (state: any) => state.parcoursInformations.infos
  );
  const modules: Module[] = useSelector(
    (state: any) => state.parcoursModules.modules
  );

  const datesParcours = {
    startDate: parcoursInfos?.startDate
      ? new Date(parcoursInfos.startDate)
      : new Date(),
    endDate: parcoursInfos?.endDate
      ? new Date(parcoursInfos.endDate)
      : new Date(),
  };

  const modulesTimelineEvents: TimelineEvent[] = (modules || [])
    .filter((mod) => mod.id !== undefined)
    .map((mod) => ({
      id: mod.id!,
      title: mod.title,
      startDate: mod.minDate ? new Date(mod.minDate) : undefined,
      endDate: mod.maxDate ? new Date(mod.maxDate) : undefined,
      image: mod.thumb ? `data:image/jpeg;base64,${mod.thumb}` : undefined,
    }));

  // --- COMMON HELPER ---
  const handleSelectModule = (
    moduleId: number | string,
    mode: "edit" | "details"
  ) => {
    const selectedModule = modules.find((m) => m.id === moduleId);
    if (selectedModule) {
      // 1. Set the intended mode (edit vs details)
      setActiveModal(mode);
      // 2. Update Redux (this triggers the useEffect in the modal)
      dispatch(parcoursModulesSliceActions.setCurrentModule(selectedModule));
    }
  };

  // --- HANDLER: EDIT DATES ---
  const handleEditModuleDates = (moduleId: number | string) => {
    handleSelectModule(moduleId, "edit");
  };

  // --- HANDLER: SHOW DETAILS ---
  const handleShowModuleDetails = (moduleId: number | string) => {
    handleSelectModule(moduleId, "details");
  };

  // --- HANDLER: CLOSE MODALS ---
  const handleCloseModal = () => {
    setActiveModal(null);
  };

  useEffect(() => {
    return () => {
      dispatch(parcoursModulesSliceActions.setCurrentModule(null));
    };
  }, [dispatch]);

  if (!modules || !parcoursInfos) {
    return (
      <div className="flex flex-col gap-y-5 p-10 items-center justify-center h-full">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p>Chargement du calendrier...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-5 h-full">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <h1 className="text-2xl font-bold">Calendrier des Modules</h1>
        <div
          className={`text-sm px-4 py-2 rounded-lg border ${
            darkMode
              ? "bg-slate-800 border-slate-700"
              : "bg-gray-50 border-gray-200"
          }`}
        >
          <span className="font-semibold">Dates du parcours : </span>
          {`${formatDate(datesParcours.startDate)} -
          ${formatDate(datesParcours.endDate)}`}
        </div>
      </div>

      <div className="flex-1 min-h-0 border rounded-xl shadow-sm overflow-hidden">
        <Calendar
          currentDate={currentDate}
          events={[]}
          startHour={8}
          endHour={18}
          view={"year-timeline"}
          timelineEvents={modulesTimelineEvents}
          darkMode={darkMode}
          // PASS HANDLERS
          onClickDetailsTimelineYearEvent={handleShowModuleDetails}
          onClickEditTimelineYearEvent={handleEditModuleDates}
        />
      </div>

      {/* DETAILS MODAL */}
      <ModuleDetailsModal
        modalId="module_details_modal"
        isOpen={activeModal === "details"} // Only opens if mode is details
        onClose={handleCloseModal}
      />

      {/* EDIT DATES MODAL */}
      <ModuleDateModal
        modalId="module_dates_modal"
        datesParcours={datesParcours}
        isOpen={activeModal === "edit"}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Calendrier;
