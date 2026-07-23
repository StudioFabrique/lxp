import { RouteObject } from "react-router";
import { lazyRoute } from "../../utils/helpers/router-helpers";

export const adminProfileRoutes: RouteObject[] = [
  {
    path: "profil",
    lazy: lazyRoute(() => import("./views/Profile")),
  },
];

export const studentProfileRoutes: RouteObject[] = [
  {
    path: "profil",
    lazy: lazyRoute(() => import("./views/Profile")),
  },
];
