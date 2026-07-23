import { RouteObject } from "react-router";
import { lazyRoute } from "../../utils/helpers/router-helpers";

export const adminDashboardIARoutes: RouteObject[] = [
  {
    path: "dashboard-ia",
    lazy: lazyRoute(() => import("./views/DashboardIAHome")),
  },
];
