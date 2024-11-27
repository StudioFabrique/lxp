import { Outlet } from "react-router-dom";

export default function LayoutLesson() {
  return (
    <div className="w-full flex gap-2">
      <div className="w-full min-h-screen">
        <Outlet />
      </div>
    </div>
  );
}
