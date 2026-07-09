import Wrapper from "../../../../../src/components/wrappers/BoxWrapper";

type Props = {
  address: string;
  addressError: boolean;
  onAddress: (v: string) => void;
  city: string;
  cityError: boolean;
  onCity: (v: string) => void;
  postCode: string;
  postCodeError: boolean;
  onPostCode: (v: string) => void;
  phone: string;
  phoneError: boolean;
  onPhone: (v: string) => void;
  birthDate: Date | null;
  onChangeDate: (date: Date | null) => void;
  disabled?: boolean;
};

const inputStyle = (hasError: boolean) =>
  hasError
    ? "input input-error text-error input-sm input-bordered focus:outline-none w-full"
    : "input input-sm input-bordered focus:outline-none w-full";

const UserFormContact = ({
  address, addressError, onAddress,
  city, cityError, onCity,
  postCode, postCodeError, onPostCode,
  phone, phoneError, onPhone,
  birthDate, onChangeDate, disabled,
}: Props) => (
  <Wrapper>
    <h2 className="font-bold text-xl">Contact</h2>
    <span className="flex flex-col gap-y-2">
      <label>Date de naissance</label>
      <input
        className="input input-sm input-bordered focus:outline-none w-full"
        type="date"
        onChange={(e) => onChangeDate(e.currentTarget.valueAsDate)}
        value={birthDate ? new Date(birthDate).toISOString().split("T")[0] : ""}
        autoComplete="off"
        disabled={disabled}
      />
    </span>
    <span className="flex flex-col gap-y-2">
      <label>Adresse</label>
      <input
        className={inputStyle(addressError && address.length > 0)}
        type="text"
        value={address}
        onChange={(e) => onAddress(e.target.value)}
        autoComplete="off"
        disabled={disabled}
      />
    </span>
    <span className="flex flex-col gap-y-2">
      <label>Ville</label>
      <input
        className={inputStyle(cityError && city.length > 0)}
        type="text"
        value={city}
        onChange={(e) => onCity(e.target.value)}
        autoComplete="off"
        disabled={disabled}
      />
    </span>
    <span className="flex flex-col gap-y-2">
      <label>Code Postal</label>
      <input
        className={inputStyle(postCodeError && postCode.length > 0)}
        type="text"
        value={postCode}
        onChange={(e) => onPostCode(e.target.value)}
        autoComplete="off"
        disabled={disabled}
      />
    </span>
    <span className="flex flex-col gap-y-2">
      <label>Téléphone</label>
      <input
        className={inputStyle(phoneError && phone.length > 0)}
        type="text"
        value={phone}
        onChange={(e) => onPhone(e.target.value)}
        autoComplete="off"
        disabled={disabled}
      />
    </span>
  </Wrapper>
);

export default UserFormContact;
