import { lazy } from "react";
import { RouteObject } from "react-router";
import { withSuspense } from "../../utils/helpers/router-helpers";

export const adminFeedbacksRoutes: RouteObject[] = [
  {
    path: "feedbacks",
    element: withSuspense(lazy(() => import("./views/FeedbacksHome"))),
  },
];
