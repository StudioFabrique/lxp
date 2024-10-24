import { useContext, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { Context } from "../../store/context.store";
import FadeWrapper from "../../components/UI/fade-wrapper/fade-wrapper";
import toast from "react-hot-toast";
import { PartyPopperIcon } from "lucide-react";
import toTitleCase from "../../utils/toTitleCase";
import PortalConfetti from "../../components/UI/portal/portal-confetti";

let initialState = true;

const StudentLayout = () => {
  const { initTheme, isLoggedIn, user, socket, handshake, fetchRoles } =
    useContext(Context);
  const nav = useNavigate();

  const [showConfetti, setShowConfetti] = useState(false);

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

  useEffect(() => {
    function congratulateUser({
      studentMdbIdToFelicitate,
      nameFrom,
    }: {
      studentMdbIdToFelicitate: string;
      nameFrom: string;
    }) {
      if (user && studentMdbIdToFelicitate === user._id) {
        toast(`Vous avez été félicité par ${toTitleCase(nameFrom)} !`, {
          icon: <PartyPopperIcon />,
        });
        setShowConfetti(true);
      }

      setTimeout(() => setShowConfetti(false), 4000);
    }

    if (!socket) return;
    socket.on("send-accomplishment", congratulateUser);

    return () => {
      socket.off("send-accomplishment", congratulateUser);
    };
  }, [socket, user]);

  return (
    <div className="w-full">
      {user && user.roles[0].rank > 2 ? (
        <div>
          {showConfetti && <PortalConfetti />}
          <FadeWrapper>
            <div className="w-full flex flex-col pl-20">
              <Outlet />
            </div>
          </FadeWrapper>
        </div>
      ) : null}
    </div>
  );
};

export default StudentLayout;
