import { lazy } from "react";
import { RouteObject } from "react-router";
import { withSuspense } from "../../utils/helpers/router-helpers";

const ResourcesLayout = lazy(() => import("./views/ResourcesLayout"));
const ResourcesHome = lazy(() => import("./views/ResourcesHome"));
const ResourceAdd = lazy(() => import("./views/ResourceAdd"));
const StudentResourcesLayout = lazy(
  () => import("./views/StudentResourcesLayout"),
);
const StudentResourceHome = lazy(() => import("./views/StudentResourceHome"));
const StudentResourceDetails = lazy(
  () => import("./views/StudentResourceDetails"),
);

export const adminResourcesRoutes: RouteObject[] = [
  {
    path: "resources",
    element: withSuspense(ResourcesLayout),
    children: [
      { index: true, element: withSuspense(ResourcesHome) },
      { path: "add", element: withSuspense(ResourceAdd) },
      { path: "edit/:resourceId", element: withSuspense(ResourceAdd) },
    ],
  },
];

export const studentResourcesRoutes: RouteObject[] = [
  {
    path: "ressources",
    element: withSuspense(StudentResourcesLayout),
    children: [
      { index: true, element: withSuspense(StudentResourceHome) },
      {
        path: "details/:resourceId",
        element: withSuspense(StudentResourceDetails),
      },
    ],
  },
];
