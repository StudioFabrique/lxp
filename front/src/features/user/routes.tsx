import { RouteObject } from "react-router";
import { lazyRoute } from "../../utils/helpers/router-helpers";
import RequireAbility from "../../components/guards/RequireAbility";

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
        element: <RequireAbility action="write" subject="user" />,
        children: [
          {
            index: true,
            lazy: lazyRoute(() => import("./views/UserAdd")),
          },
        ],
      },
      {
        path: "edit/:id",
        element: <RequireAbility action="update" subject="user" />,
        children: [
          {
            index: true,
            lazy: lazyRoute(() => import("./views/UserEdit")),
          },
        ],
      },
      {
        path: "data/:studentId",
        lazy: lazyRoute(() => import("./views/UserData")),
      },
    ],
  },
];
