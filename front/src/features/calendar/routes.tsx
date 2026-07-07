import { lazy } from "react";
import { RouteObject } from "react-router";
import { withSuspense } from "../../utils/router-helpers";

const CalendarHome = lazy(() => import("./views/CalendarHome"));

export const studentCalendarRoutes: RouteObject[] = [
  {
    path: "calendrier",
    element: withSuspense(CalendarHome),
  },
];
