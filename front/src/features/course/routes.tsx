import { RouteObject } from "react-router";
import { lazyRouteWithWrapper } from "../../utils/helpers/router-helpers";
import { CourseProvider } from "./store/CourseContext";
import RequireAbility from "../../components/guards/RequireAbility";

const wrapCourse = (el: React.ReactNode) => (
  <CourseProvider>{el}</CourseProvider>
);

export const adminCourseRoutes: RouteObject[] = [
  {
    path: "course",
    children: [
      {
        index: true,
        lazy: lazyRouteWithWrapper(
          () => import("./views/CourseHome"),
          wrapCourse,
        ),
      },
      {
        path: "edit/:courseId",
        element: <RequireAbility action="update" subject="course" />,
        children: [
          {
            index: true,
            lazy: lazyRouteWithWrapper(
              () => import("./views/CourseEdit"),
              wrapCourse,
            ),
          },
        ],
      },
      {
        path: "import",
        element: <RequireAbility action="write" subject="course" />,
        children: [
          {
            index: true,
            lazy: lazyRouteWithWrapper(
              () => import("./views/CourseImport"),
              wrapCourse,
            ),
          },
        ],
      },
    ],
  },
];
