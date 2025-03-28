import { Outlet } from "react-router-dom";

const GroupLayout = () => {
  return (
    <div className="flex flex-col p-10 gap-10">
      <Outlet />
    </div>
  );
};

export default GroupLayout;
