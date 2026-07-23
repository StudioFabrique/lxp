import { lazy } from "react";
import { RouteObject } from "react-router";
import { withSuspense } from "../../utils/helpers/router-helpers";
import { LessonProvider } from "./store/LessonContext";

const wrapLesson = (el: React.ReactNode) => (
  <LessonProvider>{el}</LessonProvider>
);

export const adminLessonRoutes: RouteObject[] = [
  {
    path: "lesson",
    children: [
      {
        index: true,
        element: wrapLesson(
          withSuspense(lazy(() => import("./views/LessonHome"))),
        ),
      },
      {
        path: "edit/:lessonId",
        element: wrapLesson(
          withSuspense(lazy(() => import("./views/LessonEdit"))),
        ),
      },
      {
        path: "preview/:activityId",
        element: wrapLesson(
          withSuspense(lazy(() => import("./views/PreviewActivity"))),
        ),
      },
    ],
  },
];
