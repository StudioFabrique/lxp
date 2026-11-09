import UserFormOptionalSection from "./UserFormOptionalSection";
import { formatDateToYYYYMMDD } from "../../../../../src/utils/helpers/convert-date";
import { parseDateValue } from "../../../../components/UI/date-picker/date-picker.utils";
import { cn } from "../../../../utils/cn";

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
  cn("input input-sm input-bordered focus:outline-none w-full", hasError && "input-error text-error");

// Borne basse de saisie : une date antérieure est une faute de frappe, pas une naissance.
const BIRTH_DATE_MIN = "1900-01-01";

const UserFormContact = ({
  address, addressError, onAddress,
  city, cityError, onCity,
  postCode, postCodeError, onPostCode,
  phone, phoneError, onPhone,
  birthDate, onChangeDate, disabled,
}: Props) => (
  <UserFormOptionalSection
    title="Contact"
    hint="Facultatif : date de naissance, adresse et téléphone"
    defaultOpen={Boolean(birthDate || address || city || postCode || phone)}
    hasError={
      (addressError && address.length > 0) ||
      (cityError && city.length > 0) ||
      (postCodeError && postCode.length > 0) ||
      (phoneError && phone.length > 0)
    }
  >
    <div className="grid grid-cols-1 gap-x-5 gap-y-4 @min-[40rem]:grid-cols-2">
    <span className="flex flex-col gap-y-2">
      {/* Saisie au clavier (jj/mm/aaaa) plutôt qu'un calendrier à parcourir année par année. */}
      <label htmlFor="birthDate">Date de naissance</label>
      <input
        id="birthDate"
        name="birthDate"
        type="date"
        className="input input-sm input-bordered focus:outline-none w-full"
        value={birthDate ? formatDateToYYYYMMDD(new Date(birthDate)) : ""}
        onChange={(e) => onChangeDate(parseDateValue(e.target.value) ?? null)}
        min={BIRTH_DATE_MIN}
        max={formatDateToYYYYMMDD(new Date())}
        autoComplete="bday"
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
        name="address"
        autoComplete="street-address"
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
        name="city"
        autoComplete="address-level2"
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
        name="postCode"
        autoComplete="postal-code"
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
        name="phoneNumber"
        autoComplete="tel"
        disabled={disabled}
      />
    </span>
    </div>
  </UserFormOptionalSection>
);

export default UserFormContact;
