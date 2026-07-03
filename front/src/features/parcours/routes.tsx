import { RouteObject } from "react-router";

// Import depuis les vues internes de la feature Parcours
// const ParcoursLayout = lazy(() => import("./views/ParcoursLayout"));
// const ParcoursHome = lazy(() => import("./views/ParcoursHome"));
// const ParcoursAdd = lazy(() => import("./views/ParcoursAdd"));
// const ParcoursEdit = lazy(() => import("./views/ParcoursEdit"));
// const ParcoursView = lazy(() => import("./views/ParcoursView"));

// Routes injectées dans /admin/parcours
export const adminParcoursRoutes: RouteObject[] = [
  {
    path: "parcours",
    element: <p>Parcours</p>,
    // element: withSuspense(ParcoursLayout),
    // children: [
    //   { index: true, element: withSuspense(ParcoursHome) },
    //   { path: "créer-un-parcours", element: withSuspense(ParcoursAdd) },
    //   { path: "edit/:id", element: withSuspense(ParcoursEdit) },
    //   { path: "view/:id", element: withSuspense(ParcoursView) },
    // ],
  },
];

// Routes injectées dans /student/parcours
export const studentParcoursRoutes: RouteObject[] = [
  {
    path: "parcours",
    element: <p>Parcours</p>,
    // element: withSuspense(ParcoursLayout),
    // children: [
    //   { index: true, element: withSuspense(ParcoursHome) },
    //   { path: "view/:id", element: withSuspense(ParcoursView) },
    // ],
  },
];
