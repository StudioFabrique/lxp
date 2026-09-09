import { ReadCalendarBrowser } from "../../../calendar/views/CalendarHome";

export default function StudentTimeline() {
  return (
    <section className="flex flex-col" aria-label="Mon emploi du temps">
      <h2 className="text-xl font-bold">Mon emploi du temps</h2>
      <ReadCalendarBrowser allowedViews={["day", "week"]} defaultView="day" />
    </section>
  );
}
