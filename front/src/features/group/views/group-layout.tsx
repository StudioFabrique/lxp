import { Outlet } from "react-router";

const GroupLayout = () => {
  return (
    <div className="w-full flex flex-col gap-6">
      <Outlet />
    </div>
  );
};

export default GroupLayout;
