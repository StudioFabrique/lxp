import Wrapper from "../../../UI/wrapper/wrapper.component";

const Presentation = () => {
  return (
    <Wrapper>
      <h2 className="font-bold text-xl">Présentation</h2>
      <span>
        <label>Nom *</label>
        <input
          className="input input-sm w-full p-[20px] pl-[30px]"
          type="text"
          onChange={lastname.valueChangeHandler}
          onBlur={lastname.valueBlurHandler}
          defaultValue={lastname.value}
          autoComplete="off"
        />
    </Wrapper>
  );
};

export default Presentation;
