import { lazy } from "react";
import { RouteObject } from "react-router";
import { withSuspense } from "../../utils/router-helpers";

const TagsHome = lazy(() => import("./views/TagsHome"));

export const adminTagsRoutes: RouteObject[] = [
  {
    path: "tags",
    element: withSuspense(TagsHome),
  },
];
