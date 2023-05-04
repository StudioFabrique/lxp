import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RootLayout from "./routes/root-layout/root-layout.component";
import Home from "./routes/home/home.component";
import ContextProvider from "./store/context.store";
import User from "./routes/test/user/user.component";
import UserAdd from "./routes/test/user/user-add.component";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [{ index: true, element: <Home /> }],
  },
  {
    path: "/userTest",
    children: [
      { index: true, element: <User /> },
      { path: "créer", element: <UserAdd /> },
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
