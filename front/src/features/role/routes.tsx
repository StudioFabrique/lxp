import { RouteObject } from "react-router";
import { lazyRoute } from "../../utils/helpers/router-helpers";

export const adminRoleRoutes: RouteObject[] = [
  {
    path: "roles",
    children: [
      {
        index: true,
        lazy: lazyRoute(() => import("./views/RoleList")),
      },
      {
        path: "edit/:id",
        lazy: lazyRoute(() => import("./views/RoleEdit")),
      },
    ],
  },
];
