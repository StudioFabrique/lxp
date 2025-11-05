import { Outlet } from "react-router-dom";
import ViewWrapper from "../../components/UI/wrapper/view-wrapper";

const GroupLayout = () => {
  return (
    <ViewWrapper className="flex flex-col gap-6">
      <Outlet />
    </ViewWrapper>
  );
};

export default GroupLayout;
