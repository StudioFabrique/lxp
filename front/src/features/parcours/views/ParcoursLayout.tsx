import { Outlet } from "react-router";
import { ParcoursProvider } from "../store/ParcoursContext";

const LayoutAdmin = () => {
  return (
    <ParcoursProvider>
      <Outlet />
    </ParcoursProvider>
  );
};

export default LayoutAdmin;
