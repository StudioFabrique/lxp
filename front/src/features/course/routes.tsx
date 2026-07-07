import { lazy } from "react";
import { RouteObject } from "react-router";
import { withSuspense } from "../../utils/router-helpers";
import { CourseProvider } from "./store/CourseContext";

const CourseHome = lazy(() => import("./views/CourseHome"));
const CourseAdd = lazy(() => import("./views/CourseAdd"));
const CourseEdit = lazy(() => import("./views/CourseEdit"));
const CourseImport = lazy(() => import("./views/CourseImport"));

const wrapCourse = (el: React.ReactNode) => (
  <CourseProvider>{el}</CourseProvider>
);

export const adminCourseRoutes: RouteObject[] = [
  {
    path: "course",
    children: [
      { index: true, element: wrapCourse(withSuspense(CourseHome)) },
      { path: "add", element: wrapCourse(withSuspense(CourseAdd)) },
      { path: "edit/:id", element: wrapCourse(withSuspense(CourseEdit)) },
      { path: "import", element: wrapCourse(withSuspense(CourseImport)) },
    ],
  },
];
