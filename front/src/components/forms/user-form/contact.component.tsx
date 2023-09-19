import { ChangeEvent, ChangeEventHandler, FC } from "react";
import Wrapper from "../../UI/wrapper/wrapper.component";

const Contact: FC<{
  address: any;
  city: any;
  postCode: any;
  phone: any;
  birthDate: Date | null;
  onChangeDate: (date: Date | null) => void;
}> = ({ address, city, postCode, phone, onChangeDate }) => {
  const handleChangeDate: ChangeEventHandler<HTMLInputElement> = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    onChangeDate(event.currentTarget.valueAsDate);
  };
  const setInputStyle = (hasError: boolean) => {
    return hasError
      ? "input input-error text-error input-sm input-bordered focus:outline-none w-full"
      : "input input-sm input-bordered focus:outline-none w-full";
  };

  return (
    <Wrapper>
      <h2 className="font-bold text-xl">Contact</h2>
      <span className="flex flex-col gap-y-2">
        <label>Date de naissance</label>
        <input
          className="input input-sm input-bordered focus:outline-none w-full"
          type="date"
          onChange={handleChangeDate}
          autoComplete="off"
        />
      </span>
      <span className="flex flex-col gap-y-2">
        <label>Adresse</label>
        <input
          className={setInputStyle(
            address.hasError && address.value.length > 0
          )}
          type="text"
          onChange={address.valueChangeHandler}
          onBlur={address.valueBlurHandler}
          defaultValue={address.value}
          autoComplete="off"
        />
      </span>
      <span className="flex flex-col gap-y-2">
        <label>Ville</label>
        <input
          className={setInputStyle(city.hasError && city.value.length > 0)}
          type="text"
          onChange={city.valueChangeHandler}
          onBlur={city.valueBlurHandler}
          defaultValue={city.value}
          autoComplete="off"
        />
      </span>
      <span className="flex flex-col gap-y-2">
        <label>Code Postal</label>
        <input
          className={setInputStyle(
            postCode.hasError && postCode.value.length > 0
          )}
          type="text"
          onChange={postCode.valueChangeHandler}
          onBlur={postCode.valueBlurHandler}
          defaultValue={postCode.value}
          autoComplete="off"
        />
      </span>
      <span className="flex flex-col gap-y-2">
        <label>Téléphone</label>
        <input
          className={setInputStyle(phone.hasError && phone.value.length > 0)}
          type="text"
          onChange={phone.valueChangeHandler}
          onBlur={phone.valueBlurHandler}
          defaultValue={phone.value}
          autoComplete="off"
        />
      </span>
    </Wrapper>
  );
};

export default Contact;
