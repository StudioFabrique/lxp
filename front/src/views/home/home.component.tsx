import { useContext } from "react";
import { Context } from "../../store/context.store";

const Home = () => {
  const { logout } = useContext(Context);

  return (
    <div className="home bg-red h-screen w-screen flex flex-col items-center">
      <p>Hey je suis la page home pour les apprenants</p>
      <button onClick={logout}>logout</button>
    </div>
  );
};

export default Home;
