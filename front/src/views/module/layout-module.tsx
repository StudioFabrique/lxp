import { Outlet } from "react-router-dom";

const LayoutModule = () => {
  return (
    <div className="flex-1 min-h-screen">
      <Outlet />
    </div>
  );
};

export default LayoutModule;
