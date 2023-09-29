import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Context } from "../../store/context.store";
import FadeWrapper from "../../components/UI/fade-wrapper/fade-wrapper";
import Login from "../../components/login/login.component";

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
    <div className="w-screen min-h-screen">
      <FadeWrapper>
        <div className="w-5/6">
          <Login />
        </div>
      </FadeWrapper>
    </div>
  );
};

export default RootLayout;
