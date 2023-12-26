import { Outlet } from "react-router-dom";

import CanAccessPage from "../../components/UI/can/can-access-page.component";

const LayoutCourse = () => {
  return (
    <CanAccessPage action="read" subject="course">
      <div className="w-screen flex gap-2 p-2">
        <div className="w-full min-h-screen pl-12">
          <Outlet />
        </div>
      </div>
    </CanAccessPage>
  );
};

export default LayoutCourse;
