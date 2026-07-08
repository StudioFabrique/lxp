import { lazy } from "react";
import { RouteObject } from "react-router";
import { withSuspense } from "../../utils/helpers/router-helpers";

const MediathequeHome = lazy(() => import("./views/MediathequeHome"));

export const adminMediathequeRoutes: RouteObject[] = [
  {
    path: "mediatheque",
    element: withSuspense(MediathequeHome),
  },
];
