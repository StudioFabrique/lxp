import { lazy } from "react";
import { RouteObject } from "react-router";
import { withSuspense } from "../../utils/helpers/router-helpers";
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
        element: wrapCourse(
          withSuspense(lazy(() => import("./views/CourseHome"))),
        ),
      },
      {
        path: "edit/:courseId",
        element: wrapCourse(
          withSuspense(lazy(() => import("./views/CourseEdit"))),
        ),
      },
      {
        path: "import",
        element: wrapCourse(
          withSuspense(lazy(() => import("./views/CourseImport"))),
        ),
      },
    ],
  },
];
