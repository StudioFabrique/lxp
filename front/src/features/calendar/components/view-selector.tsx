import { CalendarView, theme } from "../components/calendar-configuration";

type Props = {
  view: CalendarView;
  setView: (view: CalendarView) => void;
  allowedViews?: CalendarView[];
  darkMode?: boolean;
};

const ViewSelector = ({
  view,
  setView,
  allowedViews = ["day", "week", "month"],
  darkMode,
}: Props) => {
  return (
    <div
      className={`flex rounded-lg p-1 space-x-1 ${theme(darkMode).controlBg}`}
    >
      {allowedViews.map((v) => (
        <button
          key={v}
          onClick={() => setView(v)}
          className={`px-3 py-1 btn btn-xs btn-ghost text-xs font-semibold rounded-md transition-all capitalize ${
            view === v
              ? `${theme(darkMode).controlItemBg} shadow-sm`
              : `${theme(darkMode).subText} hover:opacity-80`
          }`}
        >
          {v === "day" ? "Jour" : v === "week" ? "Semaine" : "Mois"}
        </button>
      ))}
    </div>
  );
};

export default ViewSelector;
