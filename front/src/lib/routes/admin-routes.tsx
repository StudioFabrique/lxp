/* eslint-disable react-refresh/only-export-components */
import React from "react";
import RoleEdit from "../../views/role/role-edit";

const AdminHome = React.lazy(
  () => import("../../views/admin/admin-home.component")
);
const Role = React.lazy(() => import("../../views/role/role"));
const FormationAdd = React.lazy(
  () => import("../../views/formation/formation-add")
);
const UserLayout = React.lazy(
  () => import("../../views/user/user-layout.component")
);
const UserHome = React.lazy(
  () => import("../../views/user/user-home.component")
);
const UserAdd = React.lazy(() => import("../../views/user/user-add.component"));
const UserEdit = React.lazy(() => import("../../views/user/user-edit"));
const GroupLayout = React.lazy(() => import("../../views/group/group-layout"));
const GroupHome = React.lazy(() => import("../../views/group/group-home"));
const GroupManage = React.lazy(() => import("../../views/group/group-manage"));
const ParcoursLayout = React.lazy(
  () => import("../../views/parcours/parcours-layout.component")
);
const ParcoursHome = React.lazy(
  () => import("../../views/parcours/parcours-home.component")
);
const ParcoursAdd = React.lazy(
  () => import("../../views/parcours/parcours-add.component")
);
const EditParcours = React.lazy(
  () => import("../../views/parcours/parcours-edit/parcours-edit.component")
);
const ParcoursView = React.lazy(
  () => import("../../views/parcours/parcours-view")
);
const LayoutCourse = React.lazy(
  () => import("../../views/course/layout-course")
);
const CourseHome = React.lazy(() => import("../../views/course/course-home"));
const CourseStats = React.lazy(
  () => import("../../views/course/courses-stats")
);
const EditCourseHome = React.lazy(
  () => import("../../views/course/edit-course/edit-course-home")
);
const AddCourse = React.lazy(() => import("../../views/course/add-course"));
const LayoutCourseEdit = React.lazy(
  () => import("../../views/course/edit-course/layout-edit-course")
);
const LayoutModule = React.lazy(
  () => import("../../views/module/layout-module")
);
const ModuleHome = React.lazy(() => import("../../views/module/module-home"));
const LayoutLesson = React.lazy(
  () => import("../../views/lesson/layout-lesson")
);
const LessonHomePage = React.lazy(
  () => import("../../views/lesson/lesson-home-page")
);
const LayoutEditLesson = React.lazy(
  () => import("../../views/lesson/edit/layout-edit-lesson")
);
const EditLessonHome = React.lazy(
  () => import("../../views/lesson/edit/edit-lesson-home")
);
const LayoutEditModule = React.lazy(
  () => import("../../views/module/edit/Layout-edit-module")
);
const EditModuleHome = React.lazy(
  () => import("../../views/module/edit/edit-module-home")
);
const LessonsPreview = React.lazy(
  () => import("../../views/lessons-preview/lessons-preview")
);
const FeaturesList = React.lazy(
  () => import("../../views/features-list/features-list")
);
const UserProfile = React.lazy(() => import("../../views/profile/profile"));
const TeacherHome = React.lazy(
  () => import("../../views/teacher/teacher-home")
);
const RootTeacher = React.lazy(
  () => import("../../views/teacher/layout-teacher")
);
const UserData = React.lazy(() => import("../../views/teacher/user-data"));
const FeedbacksHome = React.lazy(
  () => import("../../views/feedbacks/feedbackshome")
);
const StudentEvaluationView = React.lazy(
  () => import("../../views/teacher/student-evaluation")
);

const PreviewActivity = React.lazy(
  () => import("../../views/lesson/edit/preview-activity")
);

const AddNewLesson = React.lazy(
  () => import("../../views/lesson/add/add-new-lesson")
);

const MediathequeHomePage = React.lazy(
  () => import("../../views/mediatheque/mediatheque-home-page")
);

const ModuleAdd = React.lazy(() => import("../../views/module/add/module-add"));

const EditLesson = React.lazy(
  () => import("../../views/lesson/edit/edit-lesson")
);

const TagsLayout = React.lazy(() => import("../../views/tags/tags-layout"));
const TagsHome = React.lazy(() => import("../../views/tags/tags-home"));

const adminRoutes = [
  { index: true, element: <AdminHome /> },
  {
    path: "roles",
    children: [
      { index: true, element: <Role /> },
      { path: "edit/:id", element: <RoleEdit /> },
    ],
  },
  {
    path: "formation/:formationId",
    element: <FormationAdd />,
  },
  {
    path: "formation",
    element: <FormationAdd />,
  },
  {
    path: "user",
    element: <UserLayout />,
    children: [
      { index: true, element: <UserHome /> },
      { path: "add", element: <UserAdd /> },
      { path: "edit/:id", element: <UserEdit /> },
    ],
  },
  {
    path: "group",
    element: <GroupLayout />,
    children: [
      { index: true, element: <GroupHome /> },
      { path: "add", element: <GroupManage /> },
      { path: "edit/:id", element: <GroupManage /> },
    ],
  },
  {
    path: "parcours",
    element: <ParcoursLayout />,
    children: [
      { index: true, element: <ParcoursHome /> },
      { path: "créer-un-parcours", element: <ParcoursAdd /> },
      { path: "edit/:id/", element: <EditParcours /> },
      { path: "view/:id", element: <ParcoursView /> },
      {
        path: "module/:moduleId",
        element: <LessonsPreview key="lessons-preview" />,
      },
    ],
  },
  {
    path: "course",
    element: <LayoutCourse />,
    children: [
      {
        index: true,
        element: <CourseHome />,
      },
      {
        path: "edit/:courseId",
        element: <LayoutCourseEdit />,
        children: [
          {
            index: true,
            element: <EditCourseHome />,
          },
        ],
      },
      {
        path: "add",
        element: <AddCourse />,
      },
      {
        path: "stats",
        element: <CourseStats />,
      },
    ],
  },
  {
    path: "module",
    element: <LayoutModule />,
    children: [
      {
        index: true,
        element: <ModuleHome />,
      },
      {
        path: "add",
        element: <ModuleAdd />,
      },
      {
        path: "edit/:moduleId",
        element: <LayoutEditModule />,
        children: [
          {
            index: true,
            element: <EditModuleHome />,
          },
        ],
      },
    ],
  },
  {
    path: "lesson",
    element: <LayoutLesson />,
    children: [
      {
        index: true,
        element: <LessonHomePage />,
      },
      {
        path: "edit/:lessonId",
        element: <LayoutEditLesson />,
        children: [
          {
            index: true,
            element: <EditLessonHome />,
          },
          {
            path: "preview/:activityId",
            element: <PreviewActivity />,
          },
        ],
      },
      {
        path: "add",
        element: <AddNewLesson />,
      },
      {
        path: "edit-lesson/:lessonId",
        element: <EditLesson />,
      },
    ],
  },
  { path: "profil", element: <UserProfile /> },
  {
    path: "teacher",
    element: <RootTeacher />,
    children: [
      {
        index: true,
        element: <TeacherHome />,
      },
      {
        path: "evaluations",
        element: <StudentEvaluationView />,
      },
      {
        path: "student/:studentId",
        element: <UserData />,
      },
    ],
  },
  {
    path: "feedbacks",
    element: <FeedbacksHome />,
  },
  {
    path: "mediatheque",
    element: <MediathequeHomePage />,
  },
  {
    path: "tags",
    element: <TagsLayout />,
    children: [
      { index: true, element: <TagsHome /> },
      // { path: ":tagsId", element: <TagsManage /> },
    ],
  },
  { path: "*", element: <FeaturesList /> },
];

export default adminRoutes;
