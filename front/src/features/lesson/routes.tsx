import { RouteObject } from "react-router";
import { lazyRouteWithWrapper } from "../../utils/helpers/router-helpers";
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
        lazy: lazyRouteWithWrapper(
          () => import("./views/LessonHome"),
          wrapLesson,
        ),
      },
      {
        path: "edit/:lessonId",
        lazy: lazyRouteWithWrapper(
          () => import("./views/LessonEdit"),
          wrapLesson,
        ),
      },
      {
        path: "preview/:activityId",
        lazy: lazyRouteWithWrapper(
          () => import("./views/PreviewActivity"),
          wrapLesson,
        ),
      },
    ],
  },
];
