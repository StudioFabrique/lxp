import {
  getColorByAlternateId,
  LessonData,
} from "../../../../utils/calendar-utils";

const CalendarCustomEvent = ({ event }: { event: LessonData }) => {
  const colors = event.alternateId
    ? getColorByAlternateId(event.alternateId)
    : { bgColor: "bg-primary", textColor: "text-base-100" };

  return (
    <div className={`card text-xs w-full h-full ${colors.bgColor}`}>
      <div className="card-body p-2 flex-col gap-3">
        <h3
          className={`card-title ${colors.textColor} text-sm text-wrap text-left truncate`}
        >
          {event.parcoursTitle}
        </h3>
        <span>{event.title}</span>
      </div>
    </div>
  );
};

export default CalendarCustomEvent;
