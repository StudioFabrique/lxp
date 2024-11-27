/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { Context } from "../../store/context.store";
import FadeWrapper from "../../components/UI/fade-wrapper/fade-wrapper";
import { Socket } from "socket.io-client";
import Login from "../../components/login/login.component";

let initialState = true;
let socket: Socket;

const RootLayout = () => {
  const { user, fetchRoles, initTheme, isLoggedIn, handshake } =
    useContext(Context);
  const nav = useNavigate();
  const location = useLocation();

  console.log({ isLoggedIn, user });

  useEffect(() => {
    console.log("hello toto");

    if (isLoggedIn && user && user.roles) {
      fetchRoles(user!.roles[0]);
      console.log(location.pathname.split("/"));

      if (location.pathname.split("/").length < 3) {
        console.log("hello toto 2");

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
  }, [isLoggedIn, nav]);

  if (!isLoggedIn) {
    return <Login />;
  }

  return (
    <FadeWrapper>
      <div className="w-full">
        <Outlet />
      </div>
    </FadeWrapper>
  );
};

export default RootLayout;
