import { Outlet } from "react-router-dom";

const LayoutCourse = () => {
  return (
    <div className="w-full">
      <Outlet />
    </div>
  );
};

export default LayoutCourse;
