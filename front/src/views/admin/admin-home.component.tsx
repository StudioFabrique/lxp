import { useContext } from "react";
import { Context } from "../../store/context.store";
import { Link } from "react-router-dom";

const AdminHome = () => {
  const { logout } = useContext(Context);

  const logoutHandler = () => {
    logout();
  };

  return (
    <div className="home bg-red h-screen w-screen flex flex-col items-center">
      <p>Hey je suis la page Home</p>
      <button onClick={logoutHandler}>logout</button>
      <Link to="user">Interface utilisateurs</Link>
      <Link to="group">Interface Groupes</Link>
      <Link to="parcours">Interface Parcours</Link>
      <Link to="course">Interface des Cours</Link>
      <Link to="roles">Interface Roles</Link>
      <Link to="module">Interface Module</Link>
      <Link to="profil">Profil</Link>
      <Link to="lesson">Interface Leçon</Link>
    </div>
  );
};

export default AdminHome;
