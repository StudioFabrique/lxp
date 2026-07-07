import { lazy } from "react";
import { RouteObject } from "react-router";
import { withSuspense } from "../../utils/router-helpers";

const ParcoursLayout = lazy(() => import("./views/ParcoursLayout"));
const ParcoursHome = lazy(() => import("./views/ParcoursHome"));
const ParcoursAdd = lazy(() => import("./views/ParcoursAdd"));
const ParcoursView = lazy(() => import("./views/ParcoursView"));
const EditParcours = lazy(() => import("./views/ParcoursEdit"));

export const adminParcoursRoutes: RouteObject[] = [
  {
    path: "parcours",
    element: withSuspense(ParcoursLayout),
    children: [
      { index: true, element: withSuspense(ParcoursHome) },
      { path: "add", element: withSuspense(ParcoursAdd) },
      { path: "edit/:id", element: withSuspense(EditParcours) },
      { path: "view/:id", element: withSuspense(ParcoursView) },
    ],
  },
];

export const studentParcoursRoutes: RouteObject[] = [
  {
    path: "parcours",
    element: withSuspense(ParcoursLayout),
    children: [
      { index: true, element: withSuspense(ParcoursHome) },
      { path: "view/:id", element: withSuspense(ParcoursView) },
    ],
  },
];
