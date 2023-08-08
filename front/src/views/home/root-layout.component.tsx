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
    <div className="w-screen min-h-screen flex flex-col justify-start items-center py-4 gap-y-2">
      {isLoggedIn ? (
        <FadeWrapper>
          <Outlet />
        </FadeWrapper>
      ) : (
        <FadeWrapper>
          <Login />
        </FadeWrapper>
      )}
    </div>
  );
};

export default RootLayout;
