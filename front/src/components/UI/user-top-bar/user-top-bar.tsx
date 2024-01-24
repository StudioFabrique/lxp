/* import { useContext } from "react";
import { Context } from "../../../store/context.store"; */
import { Bell, Search } from "lucide-react";
import { Context } from "../../../store/context.store";
import { useContext } from "react";

const UserTopBar = () => {
  const { user } = useContext(Context);

  console.log(user?.avatar);

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
      <button className="btn btn-primary text-white p-0 rounded-lg">
        <img
          className="max-h-[100%] rounded-lg border-2 border-primary"
          src={`data:image/jpeg;base64,${user?.avatar}`}
          alt="User Avatar"
        />
      </button>
    </div>
  );
};

export default UserTopBar;
