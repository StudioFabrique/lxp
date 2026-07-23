import { RouteObject } from "react-router";
import { lazyRoute } from "../../utils/helpers/router-helpers";

export const adminFormationRoutes: RouteObject[] = [
  {
    path: "formation",
    children: [
      {
        index: true,
        lazy: lazyRoute(() => import("./views/FormationHome")),
      },
    ],
  },
];
