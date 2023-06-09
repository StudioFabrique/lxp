import Wrapper from "../../../UI/wrapper/wrapper.component";

const Date = () => {
  return (
    <Wrapper>
      <h2 className="font-bold text-xl">Date</h2>
      <span className="flex justify-between items-center">
        <label>Début</label>
        <input
          className="input input-sm w-[85%] rounded-xs  p-[20px] pl-5"
          type="date"
        />
      </span>
      <span className="flex justify-between items-center">
        <label>Fin</label>
        <input
          className="input input-sm w-[85%] rounded-xs bg-indigo-100/60 p-[20px] pl-5"
          type="date"
        />
      </span>
    </Wrapper>
  );
};

export default Date;
