import { Bell, Search } from "lucide-react";

const UserTopBar = () => {
  return (
    <div className="self-end h-20 mx-10 flex gap-3 justify-end">
      <input
        placeholder="Que voulez-vous apprendre ?"
        className="input input-secondary bg-secondary/20"
        disabled
      />
      <button disabled className="btn btn-primary text-base-100">
        <Search />
      </button>
      <button disabled className="btn btn-primary text-base-100">
        <Bell />
      </button>
    </div>
  );
};

export default UserTopBar;
