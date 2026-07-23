import { RouteObject } from "react-router";
import { lazyRoute } from "../../utils/helpers/router-helpers";

export const studentCalendarRoutes: RouteObject[] = [
  {
    path: "calendrier",
    lazy: lazyRoute(() => import("./views/CalendarHome")),
  },
];
