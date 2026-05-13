import { Outlet } from "react-router";

const LayoutModule = () => {
  return (
    <div className="w-full">
      <Outlet />
    </div>
  );
};

export default LayoutModule;
