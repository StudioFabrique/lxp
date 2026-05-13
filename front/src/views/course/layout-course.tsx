import { Outlet } from "react-router";

const LayoutCourse = () => {
  return (
    <div className="w-full">
      <Outlet />
    </div>
  );
};

export default LayoutCourse;
