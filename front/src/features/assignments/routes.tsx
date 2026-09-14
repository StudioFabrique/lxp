import type { RouteObject } from "react-router";
import { lazyRoute } from "../../utils/helpers/router-helpers";

export const studentAssignmentRoutes: RouteObject[] = [
  {
    path: "remises-evaluations",
    lazy: lazyRoute(() => import("./views/StudentAssignments")),
  },
];
