import type { RouteObject } from "react-router";
import { lazyRoute } from "../../utils/helpers/router-helpers";

export const adminObservabilityRoutes: RouteObject[] = [
  {
    path: "journaux",
    lazy: lazyRoute(() => import("./views/ObservabilityActivity")),
  },
];
