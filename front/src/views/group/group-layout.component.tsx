import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";

const GroupLayout = () => {
  return (
    <div>
      <Toaster />
      <Outlet />
    </div>
  );
};

export default GroupLayout;
