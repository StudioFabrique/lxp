import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Context } from "../../store/context.store";
import FadeWrapper from "../../components/UI/fade-wrapper/fade-wrapper";
import Login from "../../components/login/login.component";
import Sidebar from "../../components/UI/sidebar/sidebar";

let initialState = true;

const RootLayout = () => {
  const { user, fetchRoles, initTheme, isLoggedIn, handshake } =
    useContext(Context);
  const nav = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      fetchRoles(user!.roles[0]);
      if (user && user.roles[0].rank < 3) {
        nav("/admin");
      } else if (user && user.roles[0].rank > 2) {
        nav("/student");
      }
    }
  }, [fetchRoles, nav, user, isLoggedIn]);

  useEffect(() => {
    initTheme();
    if (!isLoggedIn && initialState) {
      initialState = false;
      handshake();
    }
  }, [nav, user, initTheme, isLoggedIn, handshake]);

  return (
    <FadeWrapper>
      <div className="w-full">
        <Sidebar />
        <Login />
      </div>
    </FadeWrapper>
  );
};

export default RootLayout;
