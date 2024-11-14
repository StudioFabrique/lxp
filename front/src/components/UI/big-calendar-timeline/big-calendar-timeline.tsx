import moment from "moment/min/moment-with-locales";
import "moment/locale/fr";
import { Calendar, momentLocalizer, View, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CalendarCustomToolbar from "./calendar-custom-toolbar";
import { adjustScheduleToCurrentWeek } from "../../../utils/calendar-utils";

moment.locale("fr");
const localizer = momentLocalizer(moment);

interface Event {
  title: string;
  start: Date;
  end: Date;
  color?: string;
  gradient?: string;
}

type BigCalendarTimelineProps = {
  data: Event[];
  onRangeChange: (
    range: { start: Date; end: Date } | Date[],
    view?: View,
  ) => void;
};

const BigCalendarTimeline = ({
  data,
  onRangeChange,
}: BigCalendarTimelineProps) => {
  const pastelColors = [
    "#FF9AA2", // Soft red
    "#B5EAD7", // Mint green
    "#C7CEEA", // Periwinkle blue
    "#FFDAC1", // Peach
    "#FFB7B2", // Coral pink
    "#E2F0CB", // Light lime
  ];

  const softGradients = [
    "linear-gradient(135deg, #FFE259, #FFA751)", // Warm yellow-orange
    "linear-gradient(135deg, #00C6FB, #005BEA)", // Vibrant blue
    "linear-gradient(135deg, #F093FB, #F5576C)", // Pink-red
    "linear-gradient(135deg, #81FBB8, #28C76F)", // Fresh green
    "linear-gradient(135deg, #FF9A9E, #FAD0C4)", // Soft coral
    "linear-gradient(135deg, #A8EDEA, #C5D1EB)", // Aqua-blue
  ];

  const getRandomStyle = () => {
    const useGradient = Math.random() > 0.6; // Slightly less chance of gradient
    if (useGradient) {
      return softGradients[Math.floor(Math.random() * softGradients.length)];
    }
    return pastelColors[Math.floor(Math.random() * pastelColors.length)];
  };

  const dataAdjusted = adjustScheduleToCurrentWeek(data).map((event) => ({
    ...event,
    gradient: getRandomStyle(),
  }));

  return (
    <Calendar
      culture="fr"
      localizer={localizer}
      events={dataAdjusted}
      startAccessor={(event: Event) => event.start}
      endAccessor={(event: Event) => event.end}
      views={["work_week"]}
      defaultView={Views.WORK_WEEK}
      className="h-[98%] bg-base-100 rounded-2xl shadow-2xl p-6 border-2 border-base-300 text-base-content"
      min={new Date(2025, 1, 0, 8, 0, 0)}
      max={new Date(2025, 1, 0, 18, 0, 0)}
      components={{
        toolbar: CalendarCustomToolbar,
      }}
      formats={{
        dayHeaderFormat: (date: Date) => moment(date).format("dddd DD"),
        timeGutterFormat: (date: Date) => moment(date).format("HH:mm"),
        dayFormat: (date: Date) =>
          moment(date)
            .format("dddd DD")
            .replace(/^\w/, (c) => c.toUpperCase()),
        dayRangeHeaderFormat: (range) =>
          `Semaine du ${moment(range.start).format("DD MMMM")} au ${moment(range.end).format("DD MMMM")}`,
      }}
      slotPropGetter={() => ({
        className: "border-base-300 text-sm font-inter p-3",
      })}
      eventPropGetter={(event: Event) => ({
        style: {
          background: event.gradient,
          color: "#4a5568",
        },
        className:
          "rounded-xl font-bold p-2 px-3 shadow-sm cursor-pointer transition-all duration-300 hover:-translate-y-[2px] hover:shadow-md hover:scale-[1.02] border border-gray-200",
      })}
      step={60}
      timeslots={1}
      onRangeChange={onRangeChange}
    />
  );
};

export default BigCalendarTimeline;
