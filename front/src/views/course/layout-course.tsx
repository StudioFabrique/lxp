import { Outlet } from "react-router-dom";

const LayoutCourse = () => {
  return (
    <div className="min-w-screen min-h-screen">
      <Outlet />
    </div>
  );
};

export default LayoutCourse;
