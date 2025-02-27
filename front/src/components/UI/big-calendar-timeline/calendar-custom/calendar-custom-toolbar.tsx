import { ArrowLeft, ArrowRight } from "lucide-react";
import { View, Views, ViewsProps } from "react-big-calendar";
import ActionsDropdown from "../../actions-dropdown/actions-dropdown";

interface ToolbarProps {
  onNavigate: (action: "PREV" | "NEXT" | "TODAY") => void;
  label: string;
  views: ViewsProps;
  onView: (view: View) => void;
  view: string;
}

// Custom toolbar component
const CalendarCustomToolbar = (toolbar: ToolbarProps) => {
  const goToBack = () => {
    toolbar.onNavigate("PREV");
  };

  const goToNext = () => {
    toolbar.onNavigate("NEXT");
  };

  const goToCurrent = () => {
    toolbar.onNavigate("TODAY");
  };

  const changeView = (data: View) => {
    toolbar.onView(data);
  };

  return (
    <div className="flex flex-col lg:flex-row justify-between items-center gap-2 bg-base-200 p-4 rounded-lg shadow-lg">
      <div className="flex flex-wrap gap-1 sm:gap-2 order-1 sm:order-1">
        <button
          type="button"
          onClick={goToBack}
          className="btn btn-primary text-base-200 btn-sm gap-1 sm:gap-2 hover:scale-105 transition-transform"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          {toolbar.view === "month"
            ? "Précédent"
            : toolbar.view === "day"
              ? "Précédent"
              : "Précédent"}
        </button>
        <button
          type="button"
          onClick={goToCurrent}
          className="btn btn-accent text-base-200 btn-sm hover:scale-105 transition-transform"
        >
          Aujourd'hui
        </button>
        <button
          type="button"
          onClick={goToNext}
          className="btn btn-secondary text-base-200 btn-sm gap-1 sm:gap-2 hover:scale-105 transition-transform"
        >
          {toolbar.view === "month"
            ? "Suivant"
            : toolbar.view === "day"
              ? "Suivant"
              : "Suivant"}
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
      <div className="flex font-bold text-base-content items-center gap-2 sm:gap-4 order-2 sm:order-2">
        <span className="text-base tracking-wide">{toolbar.label}</span>
        <ActionsDropdown
          actions={[
            { actionTitle: "Vue jour", data: Views.DAY, onClick: changeView },
            {
              actionTitle: "Vue semaine",
              data: Views.WORK_WEEK,
              onClick: changeView,
            },
            { actionTitle: "Vue mois", data: Views.MONTH, onClick: changeView },
          ]}
        />
      </div>
    </div>
  );
};

export default CalendarCustomToolbar;
