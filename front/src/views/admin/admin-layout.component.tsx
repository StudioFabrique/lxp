import React, { useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Context } from "../../store/context.store";
import FadeWrapper from "../../components/UI/fade-wrapper/fade-wrapper";
import Login from "../../components/login/login.component";

let initialState = true;

const AdminLayout = () => {
  const { initTheme, isLoggedIn, user, handshake } = useContext(Context);

  useEffect(() => {
    initTheme();
    if (!isLoggedIn && initialState) {
      initialState = false;
      handshake();
    }
  }, [initTheme, isLoggedIn, handshake]);

  return (
    <>
      {(user && user.roles.includes("admin")) ||
      user?.roles.includes("teacher") ? (
        <FadeWrapper>
          <div className="flex flex-1 h-screen">
            <Outlet />
          </div>
        </FadeWrapper>
      ) : (
        <FadeWrapper>
          <div className="h-screen w-full fixed">
            <Login />
          </div>
        </FadeWrapper>
      )}
    </>
  );
};

export default AdminLayout;
