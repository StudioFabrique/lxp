import { Outlet } from "react-router-dom";

const LayoutCourse = () => {
  return (
    <div className="flex-1 min-h-screen">
      <Outlet />
    </div>
  );
};

export default LayoutCourse;
