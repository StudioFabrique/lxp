/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { Context } from "../../store/context.store";
import FadeWrapper from "../../components/UI/fade-wrapper/fade-wrapper";
import Login from "../../components/login/login.component";

let initialState = true;
let socket: any;

const RootLayout = () => {
  const { user, fetchRoles, initTheme, isLoggedIn, handshake } =
    useContext(Context);
  const nav = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoggedIn && user) {
      fetchRoles(user!.roles[0]);
      if (location.pathname.split("/").length < 2) {
        if (user && user.roles[0].rank < 3) {
          nav("/admin");
        } else if (user && user.roles[0].rank > 2) {
          nav("/student");
        }
      }
    }
  }, [fetchRoles, nav, user, isLoggedIn, location.pathname]);

  useEffect(() => {
    initTheme();
    if (!isLoggedIn && initialState) {
      initialState = false;
      handshake();
    }
  }, [initTheme, isLoggedIn, handshake]);

  useEffect(() => {
    if (!isLoggedIn && socket !== undefined) {
      socket.disconnect();
    }
  }, [isLoggedIn]);

  return (
    <FadeWrapper>
      <div className="w-full">{!isLoggedIn ? <Login /> : <Outlet />}</div>
    </FadeWrapper>
  );
};

export default RootLayout;
