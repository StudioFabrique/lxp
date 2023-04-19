import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RootLayout from "./routes/root-layout/root-layout.component";
import Home from "./routes/home/home.component";
import ContextProvider from "./store/context.store";
import Cours from "./routes/cours/cours.component";
import Settings from "./routes/settings/settings.component";
import Profile from "./routes/profile/profile.component";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "cours", element: <Cours /> },
      { path: "paramètres", element: <Settings /> },
      { path: "profil", element: <Profile /> },
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
