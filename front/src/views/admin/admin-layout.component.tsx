import { useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Context } from "../../store/context.store";
import FadeWrapper from "../../components/UI/fade-wrapper/fade-wrapper";
import Login from "../../components/login/login.component";
import { hasRole } from "../../utils/hasRole";

let initialState = true;

const AdminLayout = () => {
  const { initTheme, isLoggedIn, user, handshake, fetchRoles } =
    useContext(Context);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  useEffect(() => {
    initTheme();
    if (!isLoggedIn && initialState) {
      initialState = false;
      handshake();
    }
  }, [initTheme, isLoggedIn, handshake]);

  return (
    <>
      {user && (hasRole(1, user!.roles) || hasRole(2, user!.roles)) ? (
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
