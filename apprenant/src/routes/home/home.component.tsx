import React, { useContext } from "react";
import { Context } from "../../store/context.store";

const Home = () => {
  const { logout } = useContext(Context);

  return (
    <div className="home bg-red h-screen w-screen">
      Home <br />
      <button className="logout" onClick={logout}>
        logout
      </button>
    </div>
  );
};

export default Home;
