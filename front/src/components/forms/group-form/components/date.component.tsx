const Date = () => {
  return (
    <div className="p-4 bg-slate-100/80 rounded-2xl gap-y-5 flex flex-col">
      <h2 className="font-bold text-lg">Date</h2>
      <span className="flex justify-between items-center">
        <label>Début</label>
        <input
          className="input input-sm w-[85%] rounded-xs bg-indigo-100/60 p-[20px] pl-[30px]"
          type="date"
        />
      </span>
      <span className="flex justify-between items-center">
        <label>Fin</label>
        <input
          className="input input-sm w-[85%] rounded-xs bg-indigo-100/60 p-[20px] pl-[30px]"
          type="date"
        />
      </span>
    </div>
  );
};

export default Date;
