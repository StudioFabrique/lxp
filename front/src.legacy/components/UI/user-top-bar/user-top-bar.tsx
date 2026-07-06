const UserTopBar = () => {
  return (
    <div className="flex flex-col gap-4 bg-base-100 text-base border-1 border-base-300 p-5 rounded-lg">
      <input
        placeholder="Que voulez-vous apprendre ?"
        className="input input-secondary bg-secondary/20"
        disabled
      />
    </div>
  );
};

export default UserTopBar;
