import { lazy } from "react";
import { RouteObject } from "react-router";
import { withSuspense } from "../../utils/helpers/router-helpers";

export const adminTagsRoutes: RouteObject[] = [
  {
    path: "tags",
    element: withSuspense(lazy(() => import("./views/TagsHome"))),
  },
];
