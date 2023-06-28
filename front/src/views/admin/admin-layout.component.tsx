import { useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Context } from "../../store/context.store";
import FadeWrapper from "../../components/UI/fade-wrapper/fade-wrapper";
import Login from "../../components/login/login.component";
import defineRulesFor from "../../config/rbac";

let initialState = true;

const AdminLayout = () => {
  const { initTheme, isLoggedIn, user, handshake, fetchRoles } =
    useContext(Context);

  useEffect(() => {
    if (isLoggedIn) {
      fetchRoles(user!.roles[0]);
    }
  }, [fetchRoles, user, isLoggedIn]);

  useEffect(() => {
    initTheme();
    if (!isLoggedIn && initialState) {
      initialState = false;
      handshake();
    }
  }, [initTheme, isLoggedIn, handshake]);

  useEffect(() => {
    if (user) {
      defineRulesFor(user);
    }
  }, [user]);

  return (
    <>
      {user && user.roles[0].rank < 3 ? (
        <FadeWrapper>
          <div className="flex flex-col h-screen">
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
