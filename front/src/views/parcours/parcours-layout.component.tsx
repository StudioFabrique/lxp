import { Outlet } from "react-router-dom";
import CanAccessPage from "../../components/UI/can/can-access-page.component";

const LayoutAdmin = () => {
  return (
    <div className="flex-1 min-h-screen">
      <CanAccessPage action="read" subject="parcours">
        <Outlet />
      </CanAccessPage>
    </div>
  );
};

export default LayoutAdmin;
