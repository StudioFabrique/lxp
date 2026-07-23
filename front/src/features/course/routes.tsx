import { RouteObject } from "react-router";
import { lazyRouteWithWrapper } from "../../utils/helpers/router-helpers";
import { CourseProvider } from "./store/CourseContext";

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
        lazy: lazyRouteWithWrapper(
          () => import("./views/CourseEdit"),
          wrapCourse,
        ),
      },
      {
        path: "import",
        lazy: lazyRouteWithWrapper(
          () => import("./views/CourseImport"),
          wrapCourse,
        ),
      },
    ],
  },
];
