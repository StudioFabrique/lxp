import { lazy } from "react";
import { RouteObject } from "react-router";
import { withSuspense } from "../../utils/helpers/router-helpers";

export const studentCalendarRoutes: RouteObject[] = [
  {
    path: "calendrier",
    element: withSuspense(lazy(() => import("./views/CalendarHome"))),
  },
];
