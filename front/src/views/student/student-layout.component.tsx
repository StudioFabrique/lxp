import { useContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import { Context } from "../../store/context.store";
import FadeWrapper from "../../components/UI/fade-wrapper/fade-wrapper";
import toast from "react-hot-toast";
import { PartyPopperIcon } from "lucide-react";
import toTitleCase from "../../utils/toTitleCase";
import PortalConfetti from "../../components/UI/portal/portal-confetti";
import useAuth from "../../hooks/use-auth";

const StudentLayout = () => {
  const { user, socket } = useContext(Context);
  const [showConfetti, setShowConfetti] = useState(false);
  useAuth("student");

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
