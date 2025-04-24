import { Outlet } from "react-router-dom";

export default function LayoutLesson() {
  return (
    <div className="flex-1 min-h-screen">
      <Outlet />
    </div>
  );
}
