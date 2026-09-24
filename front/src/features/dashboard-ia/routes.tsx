import { RouteObject } from "react-router";
import { lazyRoute } from "../../utils/helpers/router-helpers";

export const adminDashboardIARoutes: RouteObject[] = [
  {
    path: "dashboard-ia",
    lazy: lazyRoute(() => import("./views/DashboardIAHome")),
  },
  {
    path: "dashboard-ia/group/:groupId",
    lazy: lazyRoute(() => import("./views/GroupDropoutAnalysis")),
  },
];
