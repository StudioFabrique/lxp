import { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { Context } from "../../store/context.store";
import FadeWrapper from "../../components/UI/fade-wrapper/fade-wrapper";
import Sidebar from "../../components/UI/sidebar/sidebar";
//import Portal from "../../components/UI/portal/portal";

let initialState = true;

const AdminLayout = () => {
  const { initTheme, isLoggedIn, user, handshake, fetchRoles } =
    useContext(Context);
  const nav = useNavigate();

  useEffect(() => {
    if (isLoggedIn && user && user.roles[0].rank > 2) {
      fetchRoles(user!.roles[0]);
    } else if (!isLoggedIn || (user && user.roles[0].rank > 2)) {
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

  return (
    <div className="w-full">
      {user && user.roles[0].rank < 3 ? (
        <>
          <FadeWrapper>
            <div className="w-full flex flex-col pl-24 pr-2 py-2">
              <Outlet />
            </div>
          </FadeWrapper>
          {/*           <Portal>
            <section className="w-[30rem] h-[15rem] rounded-lg shadow-lg bottom-5 right-5 bg-slate-500 absolute p-4">
              <h2>Chat avec </h2>
            </section>
          </Portal> */}
        </>
      ) : null}
    </div>
  );
};

export default AdminLayout;
