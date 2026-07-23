import { RouteObject } from "react-router";
import { lazyRoute } from "../../utils/helpers/router-helpers";

export const adminUserRoutes: RouteObject[] = [
  {
    path: "user",
    children: [
      {
        index: true,
        lazy: lazyRoute(() => import("./views/UserHome")),
      },
      {
        path: "add",
        lazy: lazyRoute(() => import("./views/UserAdd")),
      },
      {
        path: "edit/:id",
        lazy: lazyRoute(() => import("./views/UserEdit")),
      },
    ],
  },
];
