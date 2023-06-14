import { useContext } from "react";
import { Context } from "../../store/context.store";
import { Link } from "react-router-dom";

const AdminHome = () => {
  const { logout } = useContext(Context);

  return (
    <div className="home bg-red h-screen w-screen flex flex-col items-center">
      <p>Hey je suis la page Home</p>
      <button onClick={logout}>logout</button>
      <Link to="user">Interface utilisateurs</Link>
      <Link to="group">Interface Groupes</Link>
      <Link to="parcours">Interface Parcours</Link>
    </div>
  );
};

export default AdminHome;
