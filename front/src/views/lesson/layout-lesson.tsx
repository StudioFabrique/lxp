import { Outlet } from "react-router";

export default function LayoutLesson() {
  return (
    <div className="w-full">
      <Outlet />
    </div>
  );
}
