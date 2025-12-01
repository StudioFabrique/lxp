import { Outlet } from "react-router-dom";

const LayoutAdmin = () => {
  return (
    <div className="w-full">
      <Outlet />
    </div>
  );
};

export default LayoutAdmin;
