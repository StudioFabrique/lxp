import { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Context } from "../../store/context.store";

const LayoutCourse = () => {
  const { user } = useContext(Context);
  const nav = useNavigate();

  useEffect(() => {
    console.log("Effect running, user:", user);

    // Check if user exists and has roles
    if (!user || !user.roles || user.roles.length === 0) {
      console.log("User or roles not loaded yet");
      return;
    }

    // Check the rank
    const userRank = user.roles[0].rank;
    console.log("User rank:", userRank);

    if (userRank <= 2) {
      console.log("User rank <= 2, allowing access");
      return;
    }

    console.log("Redirecting to /student");
    nav("/student");
  }, [user, nav]);

  useEffect(() => {
    console.log("hello course layout");
  }, []);
  console.log("hello course layout 2");

  return (
    <div className="min-w-screen min-h-screen">
      <Outlet />
    </div>
  );
};

export default LayoutCourse;
