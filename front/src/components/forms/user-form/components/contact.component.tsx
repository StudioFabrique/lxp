import { ChangeEvent, ChangeEventHandler, FC } from "react";
import Wrapper from "../../../UI/wrapper/wrapper.component";

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

  return (
    <Wrapper>
      <h2 className="font-bold text-xl">Contact</h2>
      <span className="flex flex-col gap-y-2">
        <label>Date de naissance</label>
        <input
          className="input input-sm w-full p-[20px] pl-[30px]"
          type="date"
          onChange={handleChangeDate}
          autoComplete="off"
        />
      </span>
      <span className="flex flex-col gap-y-2">
        <label>Adresse</label>
        <input
          className="input input-sm w-full p-[20px] pl-[30px]"
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
          className="input input-sm w-full p-[20px] pl-[30px]"
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
          className="input input-sm w-full p-[20px] pl-[30px]"
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
          className="input input-sm w-full p-[20px] pl-[30px]"
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
