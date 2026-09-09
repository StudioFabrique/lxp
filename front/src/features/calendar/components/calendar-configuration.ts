// --- CONFIGURATION ---

// Les couleurs s'appuient sur les variables DaisyUI du thème actif.
// `darkMode` reste compatible avec les appelants et ajuste seulement l'opacité.
export const eventConfig: Record<
  CalendarEventType,
  { light: string; dark: string }
> = {
  primary: {
    light: "bg-primary/15 text-base-content border-primary",
    dark: "bg-primary/25 text-base-content border-primary",
  },
  secondary: {
    light: "bg-secondary/20 text-base-content border-secondary",
    dark: "bg-secondary/30 text-base-content border-secondary",
  },
  accent: {
    light: "bg-accent/15 text-base-content border-accent",
    dark: "bg-accent/25 text-base-content border-accent",
  },
  neutral: {
    light: "bg-base-200 text-base-content border-base-content/40",
    dark: "bg-base-300 text-base-content border-base-content/40",
  },
  danger: {
    light: "bg-error/15 text-base-content border-error",
    dark: "bg-error/25 text-base-content border-error",
  },
};

export const theme = (darkMode?: boolean) => ({
  bg: "bg-base-100",
  text: "text-base-content",
  border: "border-base-300",
  subText: darkMode ? "text-base-content/70" : "text-base-content/60",
  headerBg: "bg-base-200",
  sidebarBg: "bg-base-100",
  gridLine: "border-base-300/60",
  todayText: "text-primary",
  todayBg: "bg-primary/10",
  controlBg: "bg-base-300",
  controlItemBg: "bg-base-100 text-base-content",
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

export type CalendarView = "day" | "week" | "month" | "year-timeline" | "planning";

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
