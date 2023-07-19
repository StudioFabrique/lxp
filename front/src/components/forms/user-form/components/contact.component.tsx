import { FC } from "react";
import Wrapper from "../../../UI/wrapper/wrapper.component";

const Contact: FC<{
  onChangeDate: () => void;
  address: any;
  city: any;
  postCode: any;
  phone: any;
}> = ({ onChangeDate, address, city, postCode, phone }) => {
  return (
    <Wrapper>
      <h2 className="font-bold text-xl">Contact</h2>
      <span>
        <label>Date de naissance</label>
        <input
          className="input input-sm w-full p-[20px] pl-[30px]"
          type="date"
          onChange={onChangeDate}
          autoComplete="off"
        />
      </span>
      <span>
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
      <span>
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
      <span>
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
      <span>
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
