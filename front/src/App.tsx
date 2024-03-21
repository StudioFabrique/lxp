import { RouterProvider, createBrowserRouter } from "react-router-dom";

import ContextProvider from "./store/context.store";
import RootLayout from "./views/home/root-layout.component";
import { Suspense, lazy } from "react";
import studentRoutes from "./lib/routes/students-routes";
import adminRoutes from "./lib/routes/admin-routes";
import Loader from "./components/UI/loader";

const StudentLayout = lazy(
  async () => await import("./views/student/student-layout.component")
);

const AdminLayout = lazy(
  async () => await import("./views/admin/admin-layout.component")
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      // espace apprenant
      {
        path: "student",
        element: (
          <Suspense fallback={<Loader />}>
            <StudentLayout />
          </Suspense>
        ),
        children: studentRoutes,
      },
      // espace admin - formateur
      {
        path: "admin",
        element: (
          <Suspense fallback={<Loader />}>
            <AdminLayout />
          </Suspense>
        ),
        children: adminRoutes,
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
