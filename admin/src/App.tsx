import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RootLayout from "./routes/root-layout/root-layout.component";
import Home from "./routes/home/home.component";
import ContextProvider from "./store/context.store";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [{ index: true, element: <Home /> }],
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
