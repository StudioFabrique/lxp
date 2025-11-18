import { Outlet } from "react-router-dom";

const LayoutAdmin = () => {
  return (
    <div className="flex-1 min-h-screen justify-center flex">
      <Outlet />
    </div>
  );
};

export default LayoutAdmin;
