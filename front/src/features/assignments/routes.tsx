import { Navigate, Outlet, type RouteObject } from "react-router";
import RoleRankGuard from "../../components/guards/RoleRankGuard";
import { lazyRoute } from "../../utils/helpers/router-helpers";

export const studentAssignmentRoutes: RouteObject[] = [
  {
    path: "remises-evaluations",
    lazy: lazyRoute(() => import("./views/StudentAssignments")),
  },
];

export const teacherAssignmentRoutes: RouteObject[] = [
  {
    path: "teacher/evaluations",
    element: (
      <RoleRankGuard
        ranks={[2]}
        fallback={<Navigate to="/access-denied" replace />}
      >
        <Outlet />
      </RoleRankGuard>
    ),
    children: [
      {
        index: true,
        lazy: lazyRoute(() => import("./views/TeacherAssignments")),
      },
    ],
  },
];
