import { Outlet } from "react-router-dom";

import CanAccessPage from "../../components/UI/can/can-access-page.component";

export default function LayoutLesson() {
  return (
    <CanAccessPage action="read" subject="course">
      <div className="w-screen flex gap-2 p-2">
        <div className="w-full min-h-screen">
          <Outlet />
        </div>
      </div>
    </CanAccessPage>
  );
}
