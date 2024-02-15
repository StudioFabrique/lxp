import { Bell, Search } from "lucide-react";

const UserTopBar = () => {
  return (
    <div className="self-end h-20 mx-10 flex gap-3 justify-end">
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
    </div>
  );
};

export default UserTopBar;
