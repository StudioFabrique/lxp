import { Outlet } from "react-router-dom";
import CanAccessPage from "../../components/UI/can/can-access-page.component";
import CourseSideBar from "../../components/UI/sidebars/course-sidebar";

const LayoutCourse = () => {
  return (
    <CanAccessPage action="read" subject="course">
      <div className="w-screen flex gap-2 p-2">
        <CourseSideBar />
        <div className="w-full min-h-screen pl-12">
          <Outlet />C
        </div>
      </div>
    </CanAccessPage>
  );
};

export default LayoutCourse;
