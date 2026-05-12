import { Outlet } from "react-router";

export default function ResourcesLayout() {
  return (
    <div className="flex-1">
      <Outlet />
    </div>
  );
}
