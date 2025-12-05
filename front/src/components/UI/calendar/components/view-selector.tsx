import { CalendarView, theme } from "../calendar-configuration";

type Props = {
  view: CalendarView;
  setView: (view: CalendarView) => void;
  darkMode?: boolean;
};

const ViewSelector = ({ view, setView, darkMode }: Props) => {
  return (
    <div
      className={`flex rounded-lg p-1 space-x-1 ${theme(darkMode).controlBg}`}
    >
      {(["day", "week", "month"] as const).map((v) => (
        <button
          key={v}
          onClick={() => setView(v)}
          className={`px-3 py-1 text-xs font-semibold rounded-md transition-all capitalize ${
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
