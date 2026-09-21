import { Navigate, RouteObject } from "react-router";
import { lazyRoute } from "../../utils/helpers/router-helpers";

export const adminProfileRoutes: RouteObject[] = [
  {
    path: "profil",
    element: <Navigate to="../parametres-instance" replace />,
  },
  {
    path: "parametres-instance",
    lazy: lazyRoute(() => import("./views/InstanceSettings")),
  },
  {
    path: "activer-superadmin",
    lazy: lazyRoute(() => import("./views/ActivateSuperadmin")),
  },
];

export const studentProfileRoutes: RouteObject[] = [
  {
    path: "profil",
    lazy: lazyRoute(() => import("./views/StudentProfile")),
  },
  {
    path: "mon-avancement",
    lazy: lazyRoute(() => import("./views/MyProgress")),
  },
];
