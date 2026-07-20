// --- CONFIGURATION ---

export const eventConfig: Record<
  CalendarEventType,
  { light: string; dark: string }
> = {
  primary: {
    light: "bg-blue-100 text-blue-700 border-blue-500",
    dark: "bg-blue-900/50 text-blue-100 border-blue-400",
  },
  secondary: {
    light: "bg-teal-100 text-teal-700 border-teal-500",
    dark: "bg-teal-900/50 text-teal-100 border-teal-400",
  },
  accent: {
    light: "bg-purple-100 text-purple-700 border-purple-500",
    dark: "bg-purple-900/50 text-purple-100 border-purple-400",
  },
  neutral: {
    light: "bg-slate-100 text-slate-700 border-slate-400",
    dark: "bg-slate-700/50 text-slate-200 border-slate-500",
  },
  danger: {
    light: "bg-red-100 text-red-700 border-red-500",
    dark: "bg-red-900/50 text-red-100 border-red-400",
  },
};

// --- THEME CLASSES ---
export const theme = (darkMode?: boolean) => ({
  bg: darkMode ? "bg-slate-900" : "bg-white",
  text: darkMode ? "text-slate-100" : "text-slate-800",
  border: darkMode ? "border-slate-700" : "border-slate-200",
  subText: darkMode ? "text-slate-400" : "text-slate-500",
  headerBg: darkMode ? "bg-slate-800" : "bg-slate-50",
  sidebarBg: darkMode ? "bg-slate-900" : "bg-white",
  gridLine: darkMode ? "border-slate-700/50" : "border-slate-100",
  todayText: darkMode ? "text-blue-400" : "text-blue-600",
  todayBg: darkMode ? "bg-blue-900/30" : "bg-blue-50/50",
  controlBg: darkMode ? "bg-slate-700" : "bg-slate-200",
  controlItemBg: darkMode
    ? "bg-slate-600 text-white"
    : "bg-white text-slate-900",
});

export const daysOfWeek = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
];
export const monthNames = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

// --- TYPES ---

export type CalendarEventType =
  | "primary"
  | "secondary"
  | "accent"
  | "neutral"
  | "danger";

export type CalendarView = "day" | "week" | "month" | "year-timeline";

export interface CalendarEvent {
  id: number | string;
  title: string;
  subtitle?: string;
  dayIndex?: number; // 0 = Monday, 6 = Sunday
  date?: Date;
  start: string; // Format "HH:MM"
  end: string; // Format "HH:MM"
  type: CalendarEventType;
}

export interface TimelineEvent {
  id: number | string;
  title: string;
  startDate?: Date;
  endDate?: Date;
  image?: string;
}
