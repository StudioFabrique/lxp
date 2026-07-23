import { RouteObject } from "react-router";
import { lazyRoute } from "../../utils/helpers/router-helpers";
import RequireAbility from "../../components/guards/RequireAbility";

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
        element: <RequireAbility action="update" subject="role" />,
        children: [
          {
            index: true,
            lazy: lazyRoute(() => import("./views/RoleEdit")),
          },
        ],
      },
    ],
  },
];
