import { RouteObject } from "react-router";
import { withSuspense } from "../../utils/router-helpers";
import { lazy } from "react";

// Import depuis les vues internes de la feature Group
const GroupList = lazy(() => import("./views/GroupList"));

// Routes injectées dans /admin/parcours
export const adminGroupRoutes: RouteObject[] = [
  {
    path: "group",
    element: withSuspense(GroupList),
    // children: [
    //   { index: true, element: withSuspense(ParcoursHome) },
    //   { path: "créer-un-parcours", element: withSuspense(ParcoursAdd) },
    //   { path: "edit/:id", element: withSuspense(ParcoursEdit) },
    //   { path: "view/:id", element: withSuspense(ParcoursView) },
    // ],
  },
];
