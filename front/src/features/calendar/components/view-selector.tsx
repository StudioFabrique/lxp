import { CalendarView, theme } from "../components/calendar-configuration";
import { cn } from "../../../utils/cn";

type Props = {
  view: CalendarView;
  setView: (view: CalendarView) => void;
  allowedViews?: CalendarView[];
};

const viewLabels: Partial<Record<CalendarView, string>> = {
  day: "Jour",
  week: "Semaine",
  "year-timeline": "Timeline",
};

const ViewSelector = ({
  view,
  setView,
  allowedViews = ["day", "week", "month"],
}: Readonly<Props>) => {
  return (
    <div
      data-chatbot-target="calendar-view-selector"
      className={cn("flex rounded-lg p-1 space-x-1", theme.controlBg)}
    >
      {allowedViews.map((v) => (
        <button
          key={v}
          aria-pressed={view === v}
          onClick={() => setView(v)}
          className={cn("px-3 py-1 btn btn-xs btn-ghost text-xs font-semibold rounded-md transition-all capitalize", view === v
              ? `${theme.controlItemBg} shadow-sm`
              : `${theme.subText} hover:opacity-80`)}
        >
          {viewLabels[v] ?? "Mois"}
        </button>
      ))}
    </div>
  );
};

export default ViewSelector;
