import { Outlet } from "react-router-dom";

import FadeWrapper from "../../components/UI/fade-wrapper/fade-wrapper";

const AdminLayout = () => {
  return (
    <div className="w-full">
      <FadeWrapper>
        <div className="w-full flex flex-col pl-24 pr-2 py-2">
          <Outlet />
        </div>
      </FadeWrapper>
    </div>
  );
};

export default AdminLayout;
