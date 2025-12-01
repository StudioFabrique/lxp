import { Outlet } from "react-router-dom";

const LayoutModule = () => {
  return (
    <div className="w-full">
      <Outlet />
    </div>
  );
};

export default LayoutModule;
