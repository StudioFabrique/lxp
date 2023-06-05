import React from "react";
import { Outlet } from "react-router-dom";

const ParcoursLayout = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default ParcoursLayout;
