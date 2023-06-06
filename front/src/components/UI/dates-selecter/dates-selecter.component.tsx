const DatesSelecter = () => {
  return (
    <div className="w-full flex flex-col gap-y-4 p-4 rounded-lg bg-secondary/10">
      <h3 className="font-bold text-xl">Date</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-2">
        <p>Début</p>
        <input
          className="input input-sm max-w-sm"
          name="startingDate"
          type="date"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-2">
        <p>Fin</p>
        <input
          className="input input-sm max-w-sm"
          name="endingDate"
          type="date"
        />
      </div>
    </div>
  );
};

export default DatesSelecter;
