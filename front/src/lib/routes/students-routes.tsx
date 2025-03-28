/* eslint-disable react-refresh/only-export-components */
import React from "react";

const ParcoursHome = React.lazy(
  () => import("../../views/parcours/parcours-home.component"),
);
const StudentHome = React.lazy(
  () => import("../../views/student/student-home"),
);
const ParcoursLayout = React.lazy(
  () => import("../../views/parcours/parcours-layout.component"),
);
const CalendarHome = React.lazy(
  () => import("../../views/calendar/calendar-home"),
);
const ParcoursView = React.lazy(
  () => import("../../views/parcours/parcours-view"),
);
const LessonsPreview = React.lazy(
  () => import("../../views/lessons-preview/lessons-preview"),
);
const TagsLayout = React.lazy(() => import("../../views/tags/tags-layout"));
const TagsHome = React.lazy(() => import("../../views/tags/tags-home"));
const FeaturesList = React.lazy(
  () => import("../../views/features-list/features-list"),
);
const UserProfile = React.lazy(() => import("../../views/profile/profile"));

const studentRoutes = [
  {
    index: true,
    element: <StudentHome />,
  },
  {
    path: "parcours",
    element: <ParcoursLayout />,
    children: [
      { index: true, element: <ParcoursHome /> },
      { path: "view/:id", element: <ParcoursView /> },
      { path: "module/:moduleId", element: <LessonsPreview /> },
    ],
  },
  { path: "calendrier", element: <CalendarHome /> },
  {
    path: "tags",
    element: <TagsLayout />,
    children: [
      { index: true, element: <TagsHome /> },
      // { path: ":tagsId", element: <TagsManage /> },
    ],
  },
  { path: "profil", element: <UserProfile /> },
  { path: "*", element: <FeaturesList /> },
];

export default studentRoutes;
