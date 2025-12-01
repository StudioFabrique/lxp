import { Outlet } from "react-router-dom";
import ViewWrapper from "../../components/UI/wrapper/view-wrapper";

export default function LayoutLesson() {
  return (
    <ViewWrapper className="min-h-screen flex justify-center">
      <Outlet />
    </ViewWrapper>
  );
}
