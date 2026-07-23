import { RouteObject } from "react-router";
import { lazyRoute } from "../../utils/helpers/router-helpers";
import RequireAbility from "../../components/guards/RequireAbility";

export const adminResourcesRoutes: RouteObject[] = [
  {
    path: "resources",
    lazy: lazyRoute(() => import("./views/ResourcesLayout")),
    children: [
      {
        index: true,
        lazy: lazyRoute(() => import("./views/ResourcesHome")),
      },
      {
        path: "add",
        element: <RequireAbility action="write" subject="resource" />,
        children: [
          {
            index: true,
            lazy: lazyRoute(() => import("./views/ResourceAdd")),
          },
        ],
      },
      {
        path: "edit/:resourceId",
        element: <RequireAbility action="update" subject="resource" />,
        children: [
          {
            index: true,
            lazy: lazyRoute(() => import("./views/ResourceAdd")),
          },
        ],
      },
    ],
  },
];

export const studentResourcesRoutes: RouteObject[] = [
  {
    path: "ressources",
    lazy: lazyRoute(() => import("./views/StudentResourcesLayout")),
    children: [
      {
        index: true,
        lazy: lazyRoute(() => import("./views/StudentResourceHome")),
      },
      {
        path: "details/:resourceId",
        lazy: lazyRoute(() => import("./views/StudentResourceDetails")),
      },
    ],
  },
];
