/* import { useContext } from "react";
import { Context } from "../../../store/context.store"; */
import { Bell, Search } from "lucide-react";
import { Context } from "../../../store/context.store";
import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";

const UserTopBar = () => {
  const { user } = useContext(Context);
  const { pathname } = useLocation();

  const currentRoute = pathname.split("/").slice(1) ?? [];

  console.log(user?.avatar);

  return (
    <div className="self-end h-20 mt-10 mx-10 flex gap-3">
      <input
        placeholder="Que voulez-vous apprendre ?"
        className="input input-secondary bg-secondary/20"
      />
      <button className="btn btn-primary text-white">
        <Search />
      </button>
      <button className="btn btn-primary text-white">
        <Bell />
      </button>
      <Link
        to={`/${currentRoute[0]}/profil`}
        className="btn btn-primary text-white p-0 rounded-lg"
      >
        <img
          className="max-h-[100%] rounded-lg border-2 border-primary"
          src={`data:image/jpeg;base64,${user?.avatar}`}
          alt="User Avatar"
        />
      </Link>
    </div>
  );
};

export default UserTopBar;
