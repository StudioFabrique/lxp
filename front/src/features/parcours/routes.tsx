import { lazy } from "react";
import { RouteObject } from "react-router";
import { withSuspense } from "../../utils/helpers/router-helpers";

export const adminParcoursRoutes: RouteObject[] = [
  {
    path: "parcours",
    element: withSuspense(lazy(() => import("./views/ParcoursLayout"))),
    children: [
      {
        index: true,
        element: withSuspense(lazy(() => import("./views/ParcoursHome"))),
      },
      {
        path: "new",
        element: withSuspense(lazy(() => import("./views/ParcoursAdd"))),
      },
      {
        path: "edit/:id",
        element: withSuspense(lazy(() => import("./views/ParcoursEdit"))),
      },
      {
        path: "view/:id",
        element: withSuspense(lazy(() => import("./views/ParcoursView"))),
      },
    ],
  },
];

export const studentParcoursRoutes: RouteObject[] = [
  {
    path: "parcours",
    element: withSuspense(lazy(() => import("./views/ParcoursLayout"))),
    children: [
      {
        index: true,
        element: withSuspense(lazy(() => import("./views/ParcoursHome"))),
      },
      {
        path: "view/:id",
        element: withSuspense(lazy(() => import("./views/ParcoursView"))),
      },
    ],
  },
];
