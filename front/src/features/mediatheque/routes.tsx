import { lazy } from "react";
import { RouteObject } from "react-router";
import { withSuspense } from "../../utils/helpers/router-helpers";

export const adminMediathequeRoutes: RouteObject[] = [
  {
    path: "mediatheque",
    element: withSuspense(lazy(() => import("./views/MediathequeHome"))),
  },
];
