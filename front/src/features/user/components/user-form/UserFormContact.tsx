import BoxWrapper from "../../../../../src/components/wrappers/BoxWrapper";
import { formatDateToYYYYMMDD } from "../../../../../src/utils/helpers/convert-date";
import DatePicker from "../../../../../src/components/UI/date-picker/date-picker";
import { parseDateValue } from "../../../../../src/components/UI/date-picker/date-picker.utils";

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
  <BoxWrapper>
    <h2 className="font-bold text-xl">Contact</h2>
    <span className="flex flex-col gap-y-2">
      <DatePicker
        id="birthDate"
        name="birthDate"
        label="Date de naissance"
        onChange={(value) => onChangeDate(parseDateValue(value) ?? null)}
        value={birthDate ? formatDateToYYYYMMDD(new Date(birthDate)) : ""}
        max={formatDateToYYYYMMDD(new Date())}
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
  </BoxWrapper>
);

export default UserFormContact;
