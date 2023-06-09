import { FC, FormEvent, useState } from "react";
import useInput from "../../hooks/use-input";
import { regexGeneric, regexMail } from "../../utils/constantes";
import Wrapper from "../UI/wrapper/wrapper";

type Props = {
  onSubmitUser: (newUser: {
    firstname: string;
    lastname: string;
    email: string;
    nickname?: string;
    address?: string;
    city?: string;
    postCode?: string;
    phoneNumber?: string;
    isActive: boolean;
  }) => void;
};

const UserQuickCreate: FC<Props> = ({ onSubmitUser }) => {
  const { value: email } = useInput((value) => regexMail.test(value));
  const { value: firstname } = useInput((value) => regexGeneric.test(value));
  const { value: lastname } = useInput((value) => regexGeneric.test(value));
  const { value: nickname } = useInput((value) => regexGeneric.test(value));
  const { value: address } = useInput((value) => regexGeneric.test(value));
  const { value: postCode } = useInput((value) => regexGeneric.test(value));
  const { value: city } = useInput((value) => regexGeneric.test(value));
  const { value: phoneNumber } = useInput((value) => regexGeneric.test(value));
  const [isActive, setIsActive] = useState(false);

  let formIsValid =
    email.isValid &&
    firstname.isValid &&
    lastname.isValid &&
    nickname.isValid &&
    address.isValid &&
    postCode.isValid &&
    city.isValid &&
    phoneNumber.isValid &&
    lastname.value.length > 0 &&
    firstname.value.length > 0;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (formIsValid) {
      onSubmitUser({
        email: email.value,
        firstname: firstname.value,
        lastname: lastname.value,
        nickname: nickname.value,
        address: address.value,
        city: city.value,
        postCode: postCode.value,
        phoneNumber: phoneNumber.value,
        isActive: isActive,
      });
    }
  };

  const handleToggleIsActive = () => {
    setIsActive((prevState) => !prevState);
  };

  const handleCloseDrawer = () => {
    console.log(document.getElementById("my-drawer-4"));

    document.getElementById("my-drawer-4")?.click();
  };

  return (
    <>
      <div className="flex items-center gap-x-4">
        <div onClick={handleCloseDrawer}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M11.03 3.97a.75.75 0 010 1.06l-6.22 6.22H21a.75.75 0 010 1.5H4.81l6.22 6.22a.75.75 0 11-1.06 1.06l-7.5-7.5a.75.75 0 010-1.06l7.5-7.5a.75.75 0 011.06 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold">Ajouter un nouveau Formateur</h2>
      </div>
      <div className="divider" />

      <form className="flex flex-col gap-y-8 px-4" onSubmit={handleSubmit}>
        <div>
          <label className="flex gap-x-4 items-center cursor-pointer">
            <span className="text-base-content/50">Status</span>
            <input
              type="checkbox"
              className="toggle"
              checked={isActive}
              onChange={handleToggleIsActive}
            />
            <span
              className={`label-text font-bold ${
                !isActive ? "text-base-content/50" : ""
              }`}
            >
              {isActive ? "Actif" : "Inactif"}
            </span>
          </label>
        </div>

        <div className="grid grid-cols-2 gap-x-8">
          <Wrapper>
            <div className="flex flex-col gap-y-2 w-full">
              <label className="text-base-content/50" htmlFor="lastname">
                Nom *
              </label>
              <input
                className="input input-sm input-bordered w-4/6"
                type="text"
                defaultValue={lastname.value}
                onBlur={lastname.valueBlurHandler}
                onChange={lastname.valueChangeHandler}
                placeholder="Dupont"
              />
            </div>
            <div className="flex flex-col gap-y-2 w-full">
              <label className="text-base-content/50" htmlFor="firstname">
                Prénom *
              </label>
              <input
                className="input input-sm input-bordered w-4/6"
                type="text"
                defaultValue={firstname.value}
                onBlur={firstname.valueBlurHandler}
                onChange={firstname.valueChangeHandler}
                placeholder="Jean"
              />
            </div>
            <div className="flex flex-col gap-y-2 w-full">
              <label className="text-base-content/50" htmlFor="pseudo">
                Pseudo
              </label>
              <input
                className="input input-sm input-bordered w-4/6"
                type="text"
                defaultValue={nickname.value}
                onBlur={nickname.valueBlurHandler}
                onChange={nickname.valueChangeHandler}
                placeholder="jeannot"
              />
            </div>
            <div className="flex flex-col gap-y-2 w-full">
              <label className="text-base-content/50" htmlFor="email">
                Adresse Email *
              </label>
              <input
                className="input input-sm input-bordered w-4/6"
                type="email"
                defaultValue={email.value}
                onBlur={email.valueBlurHandler}
                onChange={email.valueChangeHandler}
                placeholder="email@exemple.com"
              />
            </div>
          </Wrapper>
          <Wrapper>
            <div className="flex flex-col gap-y-2 w-full">
              <label className="text-base-content/50" htmlFor="address">
                Adresse
              </label>
              <input
                className="input input-sm input-bordered w-4/6"
                type="text"
                defaultValue={address.value}
                onBlur={address.valueBlurHandler}
                onChange={address.valueChangeHandler}
                placeholder="12 place Royale"
              />
            </div>
            <div className="flex flex-col gap-y-2 w-full">
              <label className="text-base-content/50" htmlFor="city">
                Ville
              </label>
              <input
                className="input input-sm input-bordered w-4/6"
                type="text"
                defaultValue={city.value}
                onBlur={city.valueBlurHandler}
                onChange={city.valueChangeHandler}
                placeholder="Paris"
              />
            </div>
            <div className="flex flex-col gap-y-2 w-full">
              <label className="text-base-content/50" htmlFor="postCode">
                Code Postal
              </label>
              <input
                className="input input-sm input-bordered w-4/6"
                type="text"
                defaultValue={postCode.value}
                onBlur={postCode.valueBlurHandler}
                onChange={postCode.valueChangeHandler}
                placeholder="75000"
              />
            </div>
            <div className="flex flex-col gap-y-2 w-full">
              <label className="text-base-content/50" htmlFor="phoneNumber">
                Téléphone
              </label>
              <input
                className="input input-sm input-bordered w-4/6"
                type="text"
                defaultValue={phoneNumber.value}
                onBlur={phoneNumber.valueBlurHandler}
                onChange={phoneNumber.valueChangeHandler}
                placeholder="06 07 08 09 10"
              />
            </div>
          </Wrapper>
        </div>

        <div className="w-full flex justify-end gap-x-2 pr-4 mt-8">
          <button className="btn btn-outline btn-primary font-normal w-32">
            Annuler
          </button>
          <button className="btn btn-primary w-32">Valider</button>
        </div>
      </form>
    </>
  );
};

export default UserQuickCreate;
