import { RouteObject } from "react-router";
import { lazyRoute } from "../../utils/helpers/router-helpers";

export const adminTagsRoutes: RouteObject[] = [
  {
    path: "tags",
    lazy: lazyRoute(() => import("./views/TagsHome")),
  },
];
