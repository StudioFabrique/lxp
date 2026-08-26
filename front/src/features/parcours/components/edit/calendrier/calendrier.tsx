import { useContext, useRef, useState } from "react";
import { normalizeImageSource } from "../../../../../../src/utils/images/image-source";
import Module from "../../../../../../src/utils/interfaces/module";

import Calendar from "../../../../calendar/components/calendar";
import { ThemeContext as Context } from "../../../../../store/ThemeProvider";
import { TimelineEvent } from "../../../../calendar/components/calendar-configuration";
import { formatDate } from "../../../../calendar/components/calendar-utils";
import ModuleTimelineDateModal from "./module-timeline-date-modal";
import ModuleTimelineDetailsPopover, {
  type TimelineDetailsPosition,
} from "./module-timeline-details-popover";
import { useParams } from "react-router";
import { useParcoursQuery } from "../../../hooks/useParcoursQuery";
import { useParcoursModules } from "../../../hooks/useParcoursModules";

const Calendrier = () => {
  const { theme } = useContext(Context);
  const darkMode = theme === "dark";
  const currentDate = new Date();
  const { id } = useParams();
  const parcoursId = id ? Number(id) : 0;
  const { data: parcours } = useParcoursQuery(parcoursId);
  const { modules } = useParcoursModules(parcoursId);
  const [currentModule, setCurrentModule] = useState<Module | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [activeModal, setActiveModal] = useState<"edit" | "details" | null>(
    null
  );
  const [detailsCardPosition, setDetailsCardPosition] =
    useState<TimelineDetailsPosition>();

  const datesParcours = {
    startDate: parcours?.startDate
      ? new Date(parcours.startDate)
      : new Date(),
    endDate: parcours?.endDate
      ? new Date(parcours.endDate)
      : new Date(),
  };

  const modulesTimelineEvents: TimelineEvent[] = (modules || [])
    .filter((mod) => mod.id !== undefined)
    .map((mod) => ({
      id: mod.id!,
      title: mod.title,
      startDate: mod.minDate ? new Date(mod.minDate) : undefined,
      endDate: mod.maxDate ? new Date(mod.maxDate) : undefined,
      image: mod.thumb ? normalizeImageSource(mod.thumb) : undefined,
    }));

  const handleSelectModule = (
    moduleId: number | string,
    mode: "edit" | "details"
  ) => {
    const selectedModule = modules.find((m) => m.id === moduleId);
    if (selectedModule) {
      // Set the intended mode
      setActiveModal(mode);
      setCurrentModule(selectedModule);
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
    const containerPosition = containerRef.current?.getBoundingClientRect();

    if (!containerPosition) return;

    handleSelectModule(moduleId, "details");
    setDetailsCardPosition({ anchor: position, container: containerPosition });
  };

  // --- HANDLER: CLOSE MODALS ---
  const handleCloseModal = () => {
    setActiveModal(null);
    setCurrentModule(null);
  };

  if (!modules || !parcours) {
    return (
      <div className="flex flex-col gap-y-5 p-10 items-center justify-center h-full">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p>Chargement du calendrier...</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative flex flex-col gap-y-5 h-full">
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
          onClickTimelineYearEventDetails={handleShowModuleDetails}
          onClickEditTimelineYearEvent={handleEditModuleDates}
        />
      </div>

      {/* DETAILS MODAL */}
      <ModuleTimelineDetailsPopover
        modalId="module_details_modal"
        isOpen={activeModal === "details"}
        currentModule={currentModule}
        position={detailsCardPosition}
        onClose={handleCloseModal}
      />

      {/* EDIT DATES MODAL */}
      <ModuleTimelineDateModal
        modalId="module_dates_modal"
        datesParcours={datesParcours}
        isOpen={activeModal === "edit"}
        currentModule={currentModule}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Calendrier;
