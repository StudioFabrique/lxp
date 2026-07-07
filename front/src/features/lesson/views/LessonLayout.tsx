import { Outlet } from "react-router";

export default function LessonLayout() {
  return (
    <div className="w-full">
      <Outlet />
    </div>
  );
}
