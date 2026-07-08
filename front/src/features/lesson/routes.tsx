import { lazy } from "react";
import { RouteObject } from "react-router";
import { withSuspense } from "../../utils/helpers/router-helpers";
import { LessonProvider } from "./store/LessonContext";

const LessonHome = lazy(() => import("./views/LessonHome"));
const LessonAdd = lazy(() => import("./views/LessonAdd"));
const LessonEdit = lazy(() => import("./views/LessonEdit"));
const PreviewActivity = lazy(() => import("./views/PreviewActivity"));

const wrapLesson = (el: React.ReactNode) => (
  <LessonProvider>{el}</LessonProvider>
);

export const adminLessonRoutes: RouteObject[] = [
  {
    path: "lesson",
    children: [
      { index: true, element: wrapLesson(withSuspense(LessonHome)) },
      { path: "add", element: wrapLesson(withSuspense(LessonAdd)) },
      { path: "edit/:lessonId", element: wrapLesson(withSuspense(LessonEdit)) },
      {
        path: "preview/:activityId",
        element: wrapLesson(withSuspense(PreviewActivity)),
      },
    ],
  },
];
