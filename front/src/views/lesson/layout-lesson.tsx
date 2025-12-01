import { Outlet } from "react-router-dom";

export default function LayoutLesson() {
  return (
    <div className="w-full">
      <Outlet />
    </div>
  );
}
