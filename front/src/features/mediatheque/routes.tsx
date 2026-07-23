import { RouteObject } from "react-router";
import { lazyRoute } from "../../utils/helpers/router-helpers";

export const adminMediathequeRoutes: RouteObject[] = [
  {
    path: "mediatheque",
    lazy: lazyRoute(() => import("./views/MediathequeHome")),
  },
];
