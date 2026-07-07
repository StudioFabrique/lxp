import { lazy } from "react";
import { RouteObject } from "react-router";
import { withSuspense } from "../../utils/router-helpers";

const FeedbacksHome = lazy(() => import("./views/FeedbacksHome"));

export const adminFeedbacksRoutes: RouteObject[] = [
  {
    path: "feedbacks",
    element: withSuspense(FeedbacksHome),
  },
];
