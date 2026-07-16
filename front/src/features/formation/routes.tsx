import { lazy } from "react";
import { RouteObject } from "react-router";
import { withSuspense } from "../../utils/helpers/router-helpers";

export const adminFormationRoutes: RouteObject[] = [
  {
    path: "formation",
    children: [
      {
        index: true,
        element: withSuspense(lazy(() => import("./views/FormationHome"))),
      },
    ],
  },
];
