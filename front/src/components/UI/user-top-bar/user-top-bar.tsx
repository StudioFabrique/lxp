/* import { useContext } from "react";
import { Context } from "../../../store/context.store"; */
import { Bell, Search, User } from "lucide-react";

const UserTopBar = () => {
  /* const {} = useContext(Context); */

  {
    return (
      <div className="self-end h-20 mt-10 mx-10 flex gap-3">
        <input
          placeholder="Que voulez-vous apprendre ?"
          className="input input-secondary bg-secondary"
        />
        <button className="btn btn-primary text-white">
          <Search />
        </button>
        <button className="btn btn-primary text-white">
          <Bell />
        </button>
        <button className="btn btn-primary text-white">
          <User />
        </button>
      </div>
    );
  }
};

export default UserTopBar;
