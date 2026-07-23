import { RouteObject } from "react-router";
import { lazyRoute } from "../../utils/helpers/router-helpers";

export const adminParcoursRoutes: RouteObject[] = [
  {
    path: "parcours",
    lazy: lazyRoute(() => import("./views/ParcoursLayout")),
    children: [
      {
        index: true,
        lazy: lazyRoute(() => import("./views/ParcoursHome")),
      },
      {
        path: "new",
        lazy: lazyRoute(() => import("./views/ParcoursAdd")),
      },
      {
        path: "edit/:id",
        lazy: lazyRoute(() => import("./views/ParcoursEdit")),
      },
      {
        path: "view/:id",
        lazy: lazyRoute(() => import("./views/ParcoursView")),
      },
    ],
  },
];

export const studentParcoursRoutes: RouteObject[] = [
  {
    path: "parcours",
    lazy: lazyRoute(() => import("./views/ParcoursLayout")),
    children: [
      {
        index: true,
        lazy: lazyRoute(() => import("./views/ParcoursHome")),
      },
      {
        path: "view/:id",
        lazy: lazyRoute(() => import("./views/ParcoursView")),
      },
    ],
  },
];
