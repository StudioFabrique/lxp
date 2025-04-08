import { Outlet } from "react-router-dom";

const UserLayout = () => {
  return (
    <div className="flex-1 min-h-screen flex justify-center">
      <Outlet />
    </div>
  );
};

export default UserLayout;
