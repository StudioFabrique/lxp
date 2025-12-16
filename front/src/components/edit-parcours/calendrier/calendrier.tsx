/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector, useDispatch } from "react-redux";
import { useContext, useEffect, useState } from "react";
import Module from "../../../utils/interfaces/module";
import { parcoursModulesSliceActions } from "../../../store/redux-toolkit/parcours/parcours-modules";
import Calendar from "../../UI/calendar/calendar";
import { Context } from "../../../store/context.store";
import { TimelineEvent } from "../../UI/calendar/calendar-configuration";
import { formatDate } from "../../UI/calendar/calendar-utils";
import ModuleTimelineDateModal from "./module-timeline-date-modal";
import ModuleTimelineDetailsPopover from "./module-timeline-details-popover";

const Calendrier = () => {
  const { theme } = useContext(Context);
  const darkMode = theme === "dark";
  const currentDate = new Date();
  const dispatch = useDispatch();

  const [activeModal, setActiveModal] = useState<"edit" | "details" | null>(
    null
  );
  const [detailsCardRectPosition, setDetailsCardRectPosition] =
    useState<DOMRect>();

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

  const handleSelectModule = (
    moduleId: number | string,
    mode: "edit" | "details"
  ) => {
    const selectedModule = modules.find((m) => m.id === moduleId);
    if (selectedModule) {
      // Set the intended mode
      setActiveModal(mode);
      // Update Redux
      dispatch(parcoursModulesSliceActions.setCurrentModule(selectedModule));
    }
  };

  // --- HANDLER: EDIT DATES ---
  const handleEditModuleDates = (moduleId: number | string) => {
    handleSelectModule(moduleId, "edit");
  };

  // --- HANDLER: SHOW DETAILS ---
  const handleShowModuleDetails = (
    moduleId: number | string,
    position: DOMRect
  ) => {
    handleSelectModule(moduleId, "details");
    setDetailsCardRectPosition(position);
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
          onClickDetailsTimelineYearEvent={handleShowModuleDetails}
          onClickEditTimelineYearEvent={handleEditModuleDates}
        />
      </div>

      {/* DETAILS MODAL */}
      <ModuleTimelineDetailsPopover
        modalId="module_details_modal"
        isOpen={activeModal === "details"}
        position={detailsCardRectPosition}
        onClose={handleCloseModal}
      />

      {/* EDIT DATES MODAL */}
      <ModuleTimelineDateModal
        modalId="module_dates_modal"
        datesParcours={datesParcours}
        isOpen={activeModal === "edit"}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Calendrier;
