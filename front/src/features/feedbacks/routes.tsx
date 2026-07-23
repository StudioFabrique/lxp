import { RouteObject } from "react-router";
import { lazyRoute } from "../../utils/helpers/router-helpers";

export const adminFeedbacksRoutes: RouteObject[] = [
  {
    path: "feedbacks",
    lazy: lazyRoute(() => import("./views/FeedbacksHome")),
  },
];
