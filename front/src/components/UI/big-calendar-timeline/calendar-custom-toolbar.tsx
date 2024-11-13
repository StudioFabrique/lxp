import { ArrowLeft, ArrowRight } from "lucide-react";
import { View, ViewsProps } from "react-big-calendar";

const customToolbarButtonStyles = {
  border: "none",
  color: "white",
  padding: "8px 16px",
  borderRadius: "4px",
  margin: "0 4px",
  cursor: "pointer",
  display: "flex",
  gap: "10px",
  alignItems: "center",
};

const navigationButtonColors = {
  back: {
    backgroundColor: "#F08080", // Changed to lighter red
    ":hover": {
      backgroundColor: "#CD5C5C", // Changed to lighter hover red
    },
  },
  today: {
    backgroundColor: "#3498DB",
    ":hover": {
      backgroundColor: "#2980B9",
    },
  },
  next: {
    backgroundColor: "#2ECC71",
    ":hover": {
      backgroundColor: "#27AE60",
    },
  },
};

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

  return (
    <div className="rbc-toolbar">
      <span className="rbc-btn-group" style={{ display: "flex" }}>
        <button
          type="button"
          onClick={goToBack}
          style={{
            ...customToolbarButtonStyles,
            ...navigationButtonColors.back,
          }}
        >
          <ArrowLeft />
          Semaine Précédente
        </button>
        <button
          type="button"
          onClick={goToCurrent}
          style={{
            ...customToolbarButtonStyles,
            ...navigationButtonColors.today,
          }}
        >
          Aujourd'hui
        </button>
        <button
          type="button"
          onClick={goToNext}
          style={{
            ...customToolbarButtonStyles,
            ...navigationButtonColors.next,
          }}
        >
          Semaine Suivante
          <ArrowRight />
        </button>
      </span>
      <span className="rbc-toolbar-label">{toolbar.label}</span>
    </div>
  );
};

export default CalendarCustomToolbar;
