import { Navigate, Outlet, RouteObject } from "react-router";
import { lazyRoute } from "../../utils/helpers/router-helpers";
import RoleRankGuard from "../../components/guards/RoleRankGuard";

// Les retours des apprenants sont propres à l'équipe pédagogique : un administrateur est renvoyé à l'accueil,
// même s'il a la permission de lecture.
export const adminFeedbacksRoutes: RouteObject[] = [
  {
    element: (
      <RoleRankGuard ranks={[2]} fallback={<Navigate to="/admin/dashboard" replace />}>
        <Outlet />
      </RoleRankGuard>
    ),
    children: [
      {
        path: "feedbacks",
        lazy: lazyRoute(() => import("./views/FeedbacksHome")),
      },
    ],
  },
];
