import { CalendarView, theme } from "../components/calendar-configuration";

type Props = {
  view: CalendarView;
  setView: (view: CalendarView) => void;
  allowedViews?: CalendarView[];
};

const ViewSelector = ({
  view,
  setView,
  allowedViews = ["day", "week", "month"],
}: Props) => {
  return (
    <div
      className={`flex rounded-lg p-1 space-x-1 ${theme.controlBg}`}
    >
      {allowedViews.map((v) => (
        <button
          key={v}
          aria-pressed={view === v}
          onClick={() => setView(v)}
          className={`px-3 py-1 btn btn-xs btn-ghost text-xs font-semibold rounded-md transition-all capitalize ${
            view === v
              ? `${theme.controlItemBg} shadow-sm`
              : `${theme.subText} hover:opacity-80`
          }`}
        >
          {v === "day" ? "Jour" : v === "week" ? "Semaine" : v === "year-timeline" ? "Timeline" : "Mois"}
        </button>
      ))}
    </div>
  );
};

export default ViewSelector;
