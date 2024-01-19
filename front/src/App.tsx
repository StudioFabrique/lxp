import { RouterProvider, createBrowserRouter } from "react-router-dom";

import ContextProvider from "./store/context.store";
import RootLayout from "./views/home/root-layout.component";
import AdminLayout from "./views/admin/admin-layout.component";
import AdminHome from "./views/admin/admin-home.component";
import UserLayout from "./views/user/user-layout.component";
import UserHome from "./views/user/user-home.component";
import UserAdd from "./views/user/user-add.component";
import GroupLayout from "./views/group/group-layout.component";
import GroupHome from "./views/group/group-home.component";
import GroupAdd from "./views/group/group-add.component";
import ParcoursLayout from "./views/parcours/parcours-layout.component";
import ParcoursHome from "./views/parcours/parcours-home.component";
import ParcoursAdd from "./views/parcours/parcours-add.component";
import EditParcours from "./views/parcours/parcours-edit/parcours-edit.component";
import StudentLayout from "./views/student/student-layout.component";
import StudentHome from "./views/student/student-home";
import ParcoursView from "./views/parcours/parcours-view";
import LayoutCourse from "./views/course/layout-course";
import CourseHome from "./views/course/course-home";
import EditCourseHome from "./views/course/edit-course/edit-course-home";
import AddCourse from "./views/course/add-course";
import LayoutCourseEdit from "./views/course/edit-course/layout-edit-course";
import Role from "./views/role/role";
import UserProfile from "./views/profile/profile";
import LayoutModule from "./views/module/layout-module";
import ModuleHome from "./views/module/module-home";
import LayoutLesson from "./views/lesson/layout-lesson";
import LessonHomePage from "./views/lesson/lesson-home-page";
import LayoutEditLesson from "./views/lesson/edit/layout-edit-lesson";
import EditLessonHome from "./views/lesson/edit/edit-lesson-home";
import LayoutEditModule from "./views/module/edit/Layout-edit-module";
import EditModuleHome from "./views/module/edit/edit-module-home";
import ModuleViewFromParcours from "./views/module/module-view-from-parcours";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
  },
  {
    path: "student",
    element: <StudentLayout />,
    children: [
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
          { path: "module/:moduleId", element: <ModuleViewFromParcours /> },
        ],
      },
      { path: "profil", element: <UserProfile /> },
    ],
  },
  {
    path: "admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminHome /> },
      {
        path: "roles",
        element: <Role />,
      },
      {
        path: "user",
        element: <UserLayout />,
        children: [
          { index: true, element: <UserHome /> },
          { path: "add", element: <UserAdd /> },
        ],
      },
      {
        path: "group",
        element: <GroupLayout />,
        children: [
          { index: true, element: <GroupHome /> },
          { path: "add", element: <GroupAdd /> },
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
          { path: "module/:moduleId", element: <ModuleViewFromParcours /> },
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
            ],
          },
        ],
      },
      { path: "profil", element: <UserProfile /> },
    ],
  },
]);

function App() {
  return (
    <ContextProvider>
      <RouterProvider router={router}></RouterProvider>
    </ContextProvider>
  );
}

export default App;
