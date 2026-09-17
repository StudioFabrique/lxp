// --- CONFIGURATION ---

// Les couleurs s'appuient sur les variables DaisyUI du thème actif.
export const eventConfig: Record<CalendarEventType, string> = {
  primary: "bg-primary/15 text-base-content border-primary",
  secondary: "bg-secondary/20 text-base-content border-secondary",
  accent: "bg-accent/15 text-base-content border-accent",
  neutral: "bg-base-200 text-base-content border-base-content/40",
  danger: "bg-error/15 text-base-content border-error",
  warning: "bg-warning/20 text-warning-content border-warning",
};

export const theme = {
  bg: "bg-base-100",
  text: "text-base-content",
  border: "border-base-300",
  subText: "text-base-content/70",
  headerBg: "bg-base-200",
  sidebarBg: "bg-base-100",
  gridLine: "border-base-300/60",
  todayText: "text-primary",
  todayBg: "bg-primary/10",
  controlBg: "bg-base-300",
  controlItemBg: "bg-base-100 text-base-content",
};

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
  "primary" | "secondary" | "accent" | "neutral" | "danger" | "warning";

export type CalendarView =
  "day" | "week" | "month" | "year-timeline" | "planning";

export interface CalendarEvent {
  id: number | string;
  title: string;
  subtitle?: string;
  allDay?: boolean;
  description?: string;
  rangeStart?: string;
  rangeEnd?: string;
  to?: string;
  navigationState?: {
    lessonId?: number;
    courseId?: number;
    assignmentCourseId?: number;
  };
  category?: "course" | "assignment";
  deadlineTime?: string;
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
