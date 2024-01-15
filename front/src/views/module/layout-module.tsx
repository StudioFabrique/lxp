import { Outlet } from "react-router-dom";

const LayoutModule = () => {
  return (
    <div className="flex-1">
      <Outlet />
    </div>
  );
};

export default LayoutModule;
