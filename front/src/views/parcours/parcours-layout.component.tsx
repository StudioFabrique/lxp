import { Outlet } from "react-router";

const LayoutAdmin = () => {
  return (
    <div className="w-full">
      <Outlet />
    </div>
  );
};

export default LayoutAdmin;
