const DatesSelecter = () => {
  return (
    <div className="flex flex-col gap-y-4 p-4 rounded-lg bg-secondary/20">
      <h3 className="font-bold text-xl">Date</h3>
      <div className="grid grid-cols-5 gap-2">
        <p>Début</p>
        <select className="select select-bordered select-sm w-full bg-secondary/10 max-w-xs">
          <option disabled selected>
            Small
          </option>
          <option>Small Apple</option>
          <option>Small Orange</option>
          <option>Small Tomato</option>
        </select>
        <select className="select select-bordered select-sm w-full max-w-xs">
          <option disabled selected>
            Small
          </option>
          <option>Small Apple</option>
          <option>Small Orange</option>
          <option>Small Tomato</option>
        </select>
        <select className="select select-bordered select-sm w-full max-w-xs">
          <option disabled selected>
            Small
          </option>
          <option>Small Apple</option>
          <option>Small Orange</option>
          <option>Small Tomato</option>
        </select>
        <input type="date" />
      </div>
      <p>Date Fin</p>
    </div>
  );
};

export default DatesSelecter;
