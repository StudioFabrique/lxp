import { Outlet } from "react-router-dom";

const LayoutAdmin = () => {
  return (
    <div className="flex-1 min-h-screen">
      <Outlet />
    </div>
  );
};

export default LayoutAdmin;
