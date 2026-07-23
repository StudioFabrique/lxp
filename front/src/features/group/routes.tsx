import { RouteObject } from "react-router";
import { lazyRoute } from "../../utils/helpers/router-helpers";
import { Outlet } from "react-router";
import RequireAbility from "../../components/guards/RequireAbility";

export const adminGroupRoutes: RouteObject[] = [
  {
    path: "group",
    element: (
      <div className="w-full flex flex-col gap-6">
        <Outlet />
      </div>
    ),
    children: [
      {
        index: true,
        lazy: lazyRoute(() => import("./views/GroupList")),
      },
      {
        path: "add",
        element: <RequireAbility action="write" subject="group" />,
        children: [
          {
            index: true,
            lazy: lazyRoute(() => import("./views/GroupEdit")),
          },
        ],
      },
      {
        path: "edit/:id",
        element: <RequireAbility action="update" subject="group" />,
        children: [
          {
            index: true,
            lazy: lazyRoute(() => import("./views/GroupEdit")),
          },
        ],
      },
    ],
  },
];
