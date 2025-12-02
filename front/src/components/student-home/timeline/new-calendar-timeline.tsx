import { useState, useEffect, useMemo, PropsWithChildren } from "react";

// --- TYPES ---

type CalendarEventType =
  | "primary"
  | "secondary"
  | "accent"
  | "neutral"
  | "danger";

export interface CalendarEvent {
  id: number | string;
  title: string;
  subtitle?: string;
  dayIndex: number; // 0 = Lundi, 6 = Dimanche
  start: string; // Format "HH:MM"
  end: string; // Format "HH:MM"
  type: CalendarEventType;
}

// --- CONFIGURATION DU THÈME ---
// Utilisation de classes Tailwind compatibles Dark Mode
const eventStyles: Record<CalendarEventType, string> = {
  primary: "bg-blue-100 text-blue-700 border-blue-500",
  secondary: "bg-teal-100 text-teal-700 border-teal-500",
  accent: "bg-purple-100 text-purple-700 border-purple-500",
  neutral: "bg-gray-100 text-gray-700 border-gray-400",
  danger: "bg-red-100 text-red-700 border-red-500",
};

const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

// Hauteur d'une heure en pixels (pour la compacité et l'alignement)
const HOUR_HEIGHT = 60;

// --- UTILITAIRES ---

const getMinutes = (timeStr: string) => {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
};

interface Props {
  events: CalendarEvent[];
  title?: string;
  startHour?: number; // Heure de début (ex: 7 pour 07:00)
  endHour?: number; // Heure de fin (ex: 19 pour 19:00)
  defaultView?: "week" | "day";
}

const NewCalendarTimeline = ({
  events,
  title = "Emploi du temps",
  startHour = 8, // Par défaut commence à 8h
  endHour = 19, // Par défaut finit à 19h
  defaultView = "week",
  children,
}: PropsWithChildren<Props>) => {
  const [view, setView] = useState<"week" | "day">(defaultView);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Génération de la plage horaire filtrée
  const hours = useMemo(() => {
    return Array.from({ length: endHour - startHour }, (_, i) => startHour + i);
  }, [startHour, endHour]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Calcul dynamique de la position (Top) et de la hauteur (Height)
  const getEventStyle = (start: string, end: string) => {
    const startMin = getMinutes(start);
    const endMin = getMinutes(end);
    const startOffset = startHour * 60; // Offset en minutes du début du calendrier

    // Si l'événement est hors plage, on pourrait le masquer ou le tronquer (ici version simple)
    const top = ((startMin - startOffset) / 60) * HOUR_HEIGHT;
    const height = ((endMin - startMin) / 60) * HOUR_HEIGHT;

    return {
      top: `${top}px`,
      height: `${height}px`,
    };
  };

  // Calcul de la ligne "Maintenant"
  const getCurrentTimeIndicator = () => {
    const now = currentTime;
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const startOffset = startHour * 60;

    // Position en pixels
    const top = ((currentMinutes - startOffset) / 60) * HOUR_HEIGHT;

    // Index jour (Lundi = 0)
    let dayIndex = now.getDay() - 1;
    if (dayIndex === -1) dayIndex = 6;

    // Ne pas afficher si hors plage horaire
    if (now.getHours() < startHour || now.getHours() >= endHour) return null;

    return { top: `${top}px`, dayIndex };
  };

  const timeIndicator = getCurrentTimeIndicator();

  // Filtrage des jours selon la vue
  const visibleDays = useMemo(() => {
    if (view === "week") return days;
    // En vue jour, on ne montre que le jour actuel
    let currentDayIndex = new Date().getDay() - 1;
    if (currentDayIndex === -1) currentDayIndex = 6;
    return [days[currentDayIndex]];
  }, [view]);

  // Index réel pour mapper les événements (car visibleDays change de taille)
  const getRealDayIndex = (viewIndex: number) => {
    if (view === "week") return viewIndex;
    let currentDayIndex = new Date().getDay() - 1;
    if (currentDayIndex === -1) currentDayIndex = 6;
    return currentDayIndex;
  };

  return (
    <div className="flex flex-col h-full bg-white text-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-200 font-sans">
      {/* --- HEADER (Contrôles) --- */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
        <h2 className="font-bold text-lg">{title}</h2>
        <div className="flex bg-gray-200 rounded-lg p-1 space-x-1">
          <button
            onClick={() => setView("day")}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              view === "day"
                ? "bg-white shadow text-gray-900"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Jour
          </button>
          <button
            onClick={() => setView("week")}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              view === "week"
                ? "bg-white shadow text-gray-900"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Semaine
          </button>
        </div>
      </div>

      {/* --- BODY SCROLLABLE --- */}
      <div className="flex flex-1 overflow-y-auto relative">
        {/* COLONNE HEURES (Axe Y) */}
        {/* Sticky left pour rester visible si scroll horizontal (sur mobile) */}
        <div className="sticky left-0 z-30 w-16 flex-shrink-0 bg-white border-r border-gray-100">
          <div className="h-10 border-b border-gray-100 bg-gray-50"></div>{" "}
          {/* Coin vide Header */}
          <div
            className="relative"
            style={{ height: hours.length * HOUR_HEIGHT }}
          >
            {hours.map((h) => (
              <div
                key={h}
                className="absolute w-full text-right pr-3 text-xs text-gray-400 font-medium -mt-2"
                style={{ top: `${(h - startHour) * HOUR_HEIGHT}px` }}
              >
                {h}:00
              </div>
            ))}
          </div>
        </div>

        {/* GRILLE CALENDRIER */}
        <div className="flex-1 min-w-[300px] overflow-x-auto">
          {/* EN-TÊTES (Jours) */}
          <div className="flex h-10 sticky top-0 z-20 bg-gray-50 border-b border-gray-200">
            {visibleDays.map((day, i) => {
              const realIndex = getRealDayIndex(i);
              const isToday =
                timeIndicator && timeIndicator.dayIndex === realIndex;

              return (
                <div
                  key={day}
                  className={`flex-1 flex items-center justify-center font-bold text-sm min-w-[100px] 
                    ${
                      isToday ? "text-blue-600 bg-blue-50/50" : "text-gray-500"
                    }`}
                >
                  {day}
                </div>
              );
            })}
          </div>

          {/* CONTENU (Lignes + Événements) */}
          <div
            className="relative"
            style={{ height: hours.length * HOUR_HEIGHT }}
          >
            {/* LIGNES DE FOND (Grille) */}
            <div className="absolute inset-0 flex flex-col">
              {hours.map((h) => (
                <div
                  key={h}
                  className="w-full border-b border-gray-100 box-border"
                  style={{ height: HOUR_HEIGHT }}
                ></div>
              ))}
            </div>

            {/* COLONNES (Jours) */}
            <div className="absolute inset-0 flex">
              {visibleDays.map((_, i) => {
                const dayIndex = getRealDayIndex(i);
                return (
                  <div
                    key={i}
                    className="flex-1 border-r border-gray-100 last:border-0 relative min-w-[100px] group"
                  >
                    {/* ÉVÉNEMENTS */}
                    {events
                      .filter((e) => e.dayIndex === dayIndex)
                      .map((event) => {
                        // Ne pas afficher si hors plage horaire (simple check)
                        const startH = parseInt(event.start.split(":")[0]);
                        if (startH < startHour || startH >= endHour)
                          return null;

                        return (
                          <div
                            key={event.id}
                            className={`absolute inset-x-1 rounded-md px-2 py-1 border-l-4 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden z-10 group-hover:z-20
                              ${eventStyles[event.type]} 
                            `}
                            style={getEventStyle(event.start, event.end)}
                          >
                            <div className="font-bold text-xs truncate leading-tight">
                              {event.title}
                            </div>
                            {event.subtitle && (
                              <div className="text-[10px] opacity-90 truncate">
                                {event.subtitle}
                              </div>
                            )}
                            <div className="text-[10px] opacity-75 font-mono mt-0.5">
                              {event.start} - {event.end}
                            </div>
                          </div>
                        );
                      })}

                    {/* INDICATEUR NOW */}
                    {timeIndicator && timeIndicator.dayIndex === dayIndex && (
                      <div
                        className="absolute w-full flex items-center z-30 pointer-events-none"
                        style={{ top: timeIndicator.top }}
                      >
                        <div className="w-2 h-2 rounded-full bg-red-500 -ml-1 shadow-sm ring-2 ring-white"></div>
                        <div className="h-[2px] w-full bg-red-500 opacity-50"></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewCalendarTimeline;
