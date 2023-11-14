import { Outlet } from "react-router-dom";
import CanAccessPage from "../../components/UI/can/can-access-page.component";
import ParcoursSidebar from "../../components/UI/sidebars/parcours-sidebar";

const LayoutAdmin = () => {
  return (
    <div className="w-full flex p-2">
      <ParcoursSidebar />
      <div className="flex-1 min-h-screen pl-10">

        <CanAccessPage action="read" subject="parcours">
          <Outlet />
        </CanAccessPage>
      </div>
    </div>
  );
};

export default LayoutAdmin;
