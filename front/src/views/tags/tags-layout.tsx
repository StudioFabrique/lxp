import { Outlet } from "react-router-dom";

const TagsLayout = () => {
  return (
    <div className="flex flex-col gap-6">
      <Outlet />
    </div>
  );
};

export default TagsLayout;
