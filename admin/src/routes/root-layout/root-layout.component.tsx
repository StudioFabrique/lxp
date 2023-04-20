import { useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Context } from "../../store/context.store";
import Login from "../../components/login/login.component";
import FadeWrapper from "../../components/UI/fade-wrapper/fade-wrapper";

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

export default RootLayout;
