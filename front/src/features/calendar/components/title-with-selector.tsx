import { MouseEvent, useMemo } from "react";
import { formatTitle } from "../../../utils/helpers/text-helpers";
import {
  CalendarView,
  daysOfWeek,
  monthNames,
  theme,
} from "../components/calendar-configuration";
import { getWeekBounds } from "../components/calendar-utils";
import { cn } from "../../../utils/cn";

type Props = {
  currentTitle?: string;
  availableTitles?: string[];
  currentDate: Date;
  onSelectTitle?: (title: string) => void;
  view: CalendarView;
};

const TitleWithSelector = ({
  currentTitle = "Calendrier",
  availableTitles,
  currentDate,
  onSelectTitle,
  view,
}: Props) => {
  // --- DYNAMIC DATE ---
  const dynamicDate = useMemo(() => {
    const m = monthNames[currentDate.getMonth()];
    const y = currentDate.getFullYear();
    switch (view) {
      case "day":
        return `${
          daysOfWeek[currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1]
        } ${currentDate.getDate()} ${m} ${y}`;
      case "week": {
        const weekBounds = getWeekBounds(currentDate);
        return `Semaine du ${weekBounds.firstDay.getDate()} au ${weekBounds.lastDay.getDate()} ${m} ${y}`;
      }
      case "month":
        return `${m} ${y}`;
      default:
        return null;
    }
  }, [currentDate, view]);

  const handleSelectTitle = (e: MouseEvent<HTMLAnchorElement>) => {
    const value = e.currentTarget.dataset.title;
    if (value) onSelectTitle?.(value);
  };

  // --- DATE NAVIGATION LOGIC ---
  // const handleNavigate = (direction: "prev" | "next") => {
  //   const newDate = new Date(currentDate);
  //   const offset = direction === "next" ? 1 : -1;

  //   if (view === "day") newDate.setDate(newDate.getDate() + offset);
  //   else if (view === "week") newDate.setDate(newDate.getDate() + offset * 7);
  //   else if (view === "month") newDate.setMonth(newDate.getMonth() + offset);

  //   setCurrentDate(newDate);
  // };

  // const handleToday = () => setCurrentDate(new Date());

  return (
    <div className="flex items-center">
      {availableTitles?.length ? (
        <details className="dropdown">
          <summary className="btn btn-ghost h-fit px-1 py-0 font-bold text-lg text-base-content">
            {formatTitle(currentTitle)}
          </summary>
          <ul className="menu dropdown-content bg-base-100 rounded-box w-52 p-2 shadow-sm">
            {availableTitles.map((title) => (
              <li key={title}>
                <a onClick={handleSelectTitle} data-title={title}>
                  {formatTitle(title)}
                </a>
              </li>
            ))}
          </ul>
        </details>
      ) : (
        <span className="px-1 py-0 font-bold text-lg text-base-content">
          {formatTitle(currentTitle)}
        </span>
      )}

      <span className={cn("text-sm font-normal ml-2", theme.subText)}>
        | {dynamicDate}
      </span>
    </div>
  );

  // return (
  //   <div className="flex items-center gap-1">
  //     <button
  //       onClick={() => handleNavigate("prev")}
  //       className={`p-1 rounded hover:opacity-70 ${theme.subText}`}
  //     >
  //       {/* Chevron Left */}
  //       <svg
  //         className="w-5 h-5"
  //         fill="none"
  //         stroke="currentColor"
  //         viewBox="0 0 24 24"
  //       >
  //         <path
  //           strokeLinecap="round"
  //           strokeLinejoin="round"
  //           strokeWidth={2}
  //           d="M15 19l-7-7 7-7"
  //         />
  //       </svg>
  //     </button>
  //     <button
  //       onClick={handleToday}
  //       className={`text-xs font-bold px-2 py-1 rounded border ${
  //         theme.border
  //       } hover:opacity-70`}
  //     >
  //       Aujourd'hui
  //     </button>
  //     <button
  //       onClick={() => handleNavigate("next")}
  //       className={`p-1 rounded hover:opacity-70 ${theme.subText}`}
  //     >
  //       {/* Chevron Right */}
  //       <svg
  //         className="w-5 h-5"
  //         fill="none"
  //         stroke="currentColor"
  //         viewBox="0 0 24 24"
  //       >
  //         <path
  //           strokeLinecap="round"
  //           strokeLinejoin="round"
  //           strokeWidth={2}
  //           d="M9 5l7 7-7 7"
  //         />
  //       </svg>
  //     </button>
  //   </div>
  // );
};

export default TitleWithSelector;
