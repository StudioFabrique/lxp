import { useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Context } from "../../store/context.store";
import FadeWrapper from "../../components/UI/fade-wrapper/fade-wrapper";
import Login from "../../components/login/login.component";

let initialState = true;

const RootLayout = () => {
  const { initTheme, isLoggedIn, handshake } = useContext(Context);

  useEffect(() => {
    initTheme();
    if (!isLoggedIn && initialState) {
      initialState = false;
      handshake();
    }
  }, [initTheme, isLoggedIn, handshake]);

  return (
    <>
      {isLoggedIn ? (
        <FadeWrapper>
          <Outlet />
        </FadeWrapper>
      ) : (
        <FadeWrapper>
          <Login />
        </FadeWrapper>
      )}
    </>
  );
};

export default RootLayout;
