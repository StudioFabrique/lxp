import { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { Context } from "../../store/context.store";
//import defineRulesFor from "../../config/rbac";
import FadeWrapper from "../../components/UI/fade-wrapper/fade-wrapper";
import useRbac from "../../hooks/use-rbac";

let initialState = true;

const StudentLayout = () => {
  const { initTheme, isLoggedIn, user, handshake, fetchRoles } =
    useContext(Context);
  const nav = useNavigate();

  useEffect(() => {
    if (isLoggedIn && user && user.roles[0].rank < 3) {
      fetchRoles(user!.roles[0]);
    } else if (!isLoggedIn || (user && user.roles[0].rank < 3)) {
      nav("/");
    }
  }, [fetchRoles, nav, user, isLoggedIn]);

  useEffect(() => {
    initTheme();
    if (!isLoggedIn && initialState) {
      initialState = false;
      handshake();
    }
  }, [initTheme, isLoggedIn, handshake]);

  useRbac(user?.roles); // gère l'état des permissions

  return (
    <div className="w-full">
      {user && user.roles[0].rank > 2 ? (
        <FadeWrapper>
          <div className="w-full flex flex-col h-screen">
            <Outlet />
          </div>
        </FadeWrapper>
      ) : null}
    </div>
  );
};

export default StudentLayout;
