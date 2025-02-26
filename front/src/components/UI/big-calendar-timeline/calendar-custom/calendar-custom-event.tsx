import {
  getColorByAlternateId,
  LessonData,
} from "../../../../utils/calendar-utils";

const CalendarCustomEvent = ({ event }: { event: LessonData }) => {
  const colors = event.alternateId
    ? getColorByAlternateId(event.alternateId)
    : { bgColor: "bg-primary", textColor: "text-base-100" };

  return (
    <div className={`card w-full h-full ${colors.bgColor}`}>
      <div className="card-body p-2 flex-row items-center gap-3">
        <h3
          className={`card-title ${colors.textColor} text-sm text-wrap text-center truncate`}
        >
          {event.title}
        </h3>
      </div>
    </div>
  );
};

export default CalendarCustomEvent;
