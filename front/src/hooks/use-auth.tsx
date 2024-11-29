import { useContext, useEffect } from "react";
import { Context } from "../store/context.store";
import { useNavigate } from "react-router-dom";

const useAuth = (role: string) => {
  const { user } = useContext(Context);
  const nav = useNavigate();

  useEffect(() => {
    // Check if user exists and has roles
    if (!user || !user.roles || user.roles.length === 0) {
      return;
    }

    // Check the rank
    if (user && user.roles[0] && user.roles[0].rank) {
      const userRank = user.roles[0].rank;

      switch (role) {
        case "admin":
          if (userRank < 3) return;
          else nav("/student");
          break;
        case "student":
          if (userRank === 3) return;
          else nav("/admin");
          break;
      }
      nav("/student");
    }
  }, [user, nav, role]);

  return;
};

export default useAuth;
