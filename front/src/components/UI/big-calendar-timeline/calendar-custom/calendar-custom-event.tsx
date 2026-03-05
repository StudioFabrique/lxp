import {
  getColorByAlternateId,
  LessonData,
} from "../../../../utils/calendar-utils";

const makeCustomEvent =
  (isMonth: boolean) =>
  ({ event }: { event: LessonData }) => {
    const colors = event.alternateId
      ? getColorByAlternateId(event.alternateId)
      : { bgColor: "bg-primary", textColor: "text-neutral-content" };

    if (isMonth) {
      return (
        <div
          className={`badge ${colors.bgColor} ${colors.textColor} text-[8px] truncate max-w-full`}
        >
          {event.title}
        </div>
      );
    }

    return (
      <div className={`card w-full h-full ${colors.bgColor}`}>
        <div className="card-body p-2 gap-3">
          {event.parcoursTitle ? (
            <h3
              className={`card-title ${colors.textColor} text-sm text-wrap truncate`}
            >
              {event.parcoursTitle}
            </h3>
          ) : null}
          <span
            className={`${event.parcoursTitle ? "text-xs" : "text-sm"} text-wrap truncate`}
          >
            {event.title}
          </span>
        </div>
      </div>
    );
  };

export default makeCustomEvent;
