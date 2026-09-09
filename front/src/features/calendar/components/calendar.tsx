import { ReactNode, useState } from "react";
import {
  CalendarEvent,
  CalendarView,
  theme,
  TimelineEvent,
} from "./calendar-configuration";
import MonthView from "./views/month-view";
import TimelineView from "./views/timeline-view";
import YearTimelineView from "./views/year-timeline-view";

import PlanningView from "./views/planning-view";

import CalendarOverflowModal from "./calendar-overflow-modal";

interface Props {
  onSelectDay?: (date: Date) => void;
  selectedTimelineEventId?: number | string;
  planningDisabled?: boolean;
  onChangeTimelineEventDates?: (id: number | string, startDate: Date, endDate: Date) => void;
  events: CalendarEvent[];
  onClickEventDetails?: (id: number | string, rect: DOMRect, element?: HTMLElement) => void;
  timelineEvents?: TimelineEvent[];
  onClickTimelineYearEventDetails?: (
    id: number | string,
    rect: DOMRect,
    element?: HTMLElement,
  ) => void;
  onClickEditTimelineYearEvent?: (id: number | string) => void;
  currentDate: Date;
  startHour?: number;
  endHour?: number;
  view?: CalendarView;
  currentWeekDayVisible?: boolean;
  darkMode?: boolean;
  header?: ReactNode;
  style?: { hourHeight: number };
}

const Calendar = ({
  onSelectDay,
  events,
  selectedTimelineEventId,
  planningDisabled,
  onChangeTimelineEventDates,
  onClickEventDetails,
  timelineEvents = [], // Default to empty array
  onClickTimelineYearEventDetails,
  onClickEditTimelineYearEvent,
  currentDate,
  startHour = 8,
  endHour = 19,
  view = "week",
  currentWeekDayVisible = true,
  darkMode = false,
  header,
  style = { hourHeight: 60 },
}: Props) => {
  const [overflow, setOverflow] = useState<CalendarEvent[] | null>(null);
  // Render the body
  const renderBody = () => {
    switch (view) {
      case "planning":
        return (
          <PlanningView
            events={timelineEvents}
            currentDate={currentDate}
            darkMode={darkMode}
            selectedEventId={selectedTimelineEventId}
            disabled={planningDisabled}
            onClickDetails={onClickTimelineYearEventDetails}
            onChangeDates={onChangeTimelineEventDates}
          />
        );
      case "month":
        return (
          <MonthView
            events={events}
            currentDate={currentDate}
            darkMode={darkMode}
            onClickEventDetails={onClickEventDetails}
            onShowMore={setOverflow}
          />
        );
      case "year-timeline":
        return (
          <YearTimelineView
            events={timelineEvents}
            darkMode={darkMode}
            onClickDetails={onClickTimelineYearEventDetails}
            onClickEdit={onClickEditTimelineYearEvent}
          />
        );
      case "week":
      case "day":
      default:
        return (
          <TimelineView
            onSelectDay={onSelectDay}
            events={events}
            view={view}
            startHour={startHour}
            endHour={endHour}
            currentDate={currentDate}
            currentWeekDayVisible={currentWeekDayVisible}
            darkMode={darkMode}
            style={style}
            onClickEventDetails={onClickEventDetails}
            onShowMore={setOverflow}
          />
        );
    }
  };

  return (
    <div
      className={`flex flex-col pb-1 rounded-xl shadow-xl overflow-hidden border font-sans transition-colors duration-300 ${
        theme(darkMode).bg
      } ${theme(darkMode).text} ${theme(darkMode).border}`}
    >
      {/* --- HEADER --- */}
      {header}

      {/* --- BODY --- */}
      {renderBody()}
      {overflow && <CalendarOverflowModal events={overflow} onClose={() => setOverflow(null)} onClickDetails={onClickEventDetails} />}
    </div>
  );
};

export default Calendar;
