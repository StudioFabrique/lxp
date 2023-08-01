import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./views/home/home.component";
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
import UserMultipleAdd from "./views/user/user-multiple-add";
import EditParcours from "./views/parcours/parcours-edit.component";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [{ index: true, element: <Home /> }],
  },
  {
    path: "admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminHome /> },
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
          { path: "edit/:id", element: <EditParcours /> },
        ],
      },
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
