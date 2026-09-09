import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import TimelineView from "./timeline-view";

const commonProps = {
  events: [],
  currentDate: new Date(2026, 8, 9),
  startHour: 8,
  endHour: 18,
  darkMode: false,
  currentWeekDayVisible: false,
};

it("étend le fond de la semaine sur toute la largeur horizontale scrollable", () => {
  const markup = renderToStaticMarkup(
    <TimelineView {...commonProps} view="week" />,
  );

  expect(markup).toContain(
    'data-calendar-scroll-content="true" class="min-w-[700px]"',
  );
});

it("la vue jour continue de remplir la largeur disponible", () => {
  const markup = renderToStaticMarkup(
    <TimelineView {...commonProps} view="day" />,
  );

  expect(markup).toContain(
    'data-calendar-scroll-content="true" class="min-w-full"',
  );
});
