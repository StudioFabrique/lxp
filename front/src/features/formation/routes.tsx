import { lazy } from "react";
import { RouteObject } from "react-router";
import { withSuspense } from "../../utils/router-helpers";

const FormationHome = lazy(() => import("./views/FormationHome"));

export const adminFormationRoutes: RouteObject[] = [
  {
    path: "formation",
    children: [
      { index: true, element: withSuspense(FormationHome) },
    ],
  },
];
