import React, { useContext } from "react";
import { Context } from "../../store/context.store";

const Home = () => {
  const { logout } = useContext(Context);

  return (
    <div className="bg-red h-screen w-screen">
      Home <br />
      <button onClick={logout}>logout</button>
    </div>
  );
};

export default Home;
