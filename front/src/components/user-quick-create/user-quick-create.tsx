/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, FormEvent, useState } from "react";

import useInput from "../../hooks/use-input";
import {
  regexGeneric,
  regexMail,
  regexOptionalGeneric,
} from "../../utils/constantes";
import Wrapper from "../UI/wrapper/wrapper.component";
import DrawerFormButtons from "../UI/drawer-form-buttons/drawer-form-buttons.component";

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
  const { value: nickname } = useInput((value) =>
    regexOptionalGeneric.test(value)
  );
  const { value: address } = useInput((value) =>
    regexOptionalGeneric.test(value)
  );
  const { value: postCode } = useInput((value) =>
    regexOptionalGeneric.test(value)
  );
  const { value: city } = useInput((value) => regexOptionalGeneric.test(value));
  const { value: phoneNumber } = useInput((value) =>
    regexOptionalGeneric.test(value)
  );
  const [isActive, setIsActive] = useState(true);
  const [isFormValid, setIsFormValid] = useState(true);

  const fields = [
    email,
    firstname,
    lastname,
    nickname,
    address,
    postCode,
    city,
    phoneNumber,
  ];

  const formIsValid =
    email.isValid &&
    firstname.isValid &&
    lastname.isValid &&
    nickname.isValid &&
    address.isValid &&
    postCode.isValid &&
    city.isValid &&
    phoneNumber.isValid;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (formIsValid) {
      setIsFormValid(true);
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
      //handleCloseDrawer();
    } else {
      setIsFormValid(false);
      fields.forEach((field: any) => field.isSubmitted());
    }
  };

  const handleToggleIsActive = () => {
    setIsActive((prevState) => !prevState);
  };

  const handleCloseDrawer = () => {
    handleResetForm();
    document.getElementById("new-contact")?.click();
  };

  const setInputStyle = (hasError: boolean) => {
    return hasError
      ? "input input-error text-error input-sm input-bordered w-full focus:outline-none"
      : "input input-sm input-bordered w-full focus:outline-none";
  };

  const handleResetForm = () => {
    setIsFormValid(true);
    setIsActive(true);
    fields.forEach((field: any) => field.reset());
  };

  const setErrorMessage = () => {
    return isFormValid
      ? "w-full text-xs font-bold text-error flex pr-2 invisible"
      : "w-full text-xs font-bold text-error flex pr-2 visible";
  };

  return (
    <div className="flex flex-col">
      <form className="flex flex-col gap-y-4 px-4" onSubmit={handleSubmit}>
        <div>
          <label className="flex gap-x-4 items-center cursor-pointer">
            <span className="text-primary/50">Status</span>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={isActive}
              onChange={handleToggleIsActive}
            />
            <span
              className={`label-text font-bold ${
                !isActive ? "text-primary/50" : "text-primary"
              }`}
            >
              {isActive ? "Actif" : "Inactif"}
            </span>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Wrapper>
            <div className="flex flex-col gap-y-2 w-full">
              <label className="text-base-content/50" htmlFor="lastname">
                Nom *
              </label>
              <input
                className={setInputStyle(lastname.hasError)}
                type="text"
                value={lastname.value}
                onBlur={lastname.valueBlurHandler}
                onChange={lastname.valueChangeHandler}
                placeholder="Dupont"
                name="lastname"
              />
            </div>
            <div className="flex flex-col gap-y-2 w-full">
              <label className="text-base-content/50" htmlFor="firstname">
                Prénom *
              </label>
              <input
                className={setInputStyle(firstname.hasError)}
                type="text"
                value={firstname.value}
                onBlur={firstname.valueBlurHandler}
                onChange={firstname.valueChangeHandler}
                placeholder="Jean"
                name="firstname"
              />
            </div>
            <div className="flex flex-col gap-y-2 w-full">
              <label className="text-base-content/50" htmlFor="pseudo">
                Pseudo
              </label>
              <input
                className={setInputStyle(nickname.hasError)}
                type="text"
                value={nickname.value}
                onBlur={nickname.valueBlurHandler}
                onChange={nickname.valueChangeHandler}
                name="nickname"
              />
            </div>
            <div className="flex flex-col gap-y-2 w-full">
              <label className="text-base-content/50" htmlFor="email">
                Adresse Email *
              </label>
              <input
                className={setInputStyle(email.hasError)}
                type="email"
                value={email.value}
                onBlur={email.valueBlurHandler}
                onChange={email.valueChangeHandler}
                placeholder="email@exemple.com"
                name="email"
              />
            </div>
          </Wrapper>
          <Wrapper>
            <div className="flex flex-col gap-y-2 w-full">
              <label className="text-base-content/50" htmlFor="address">
                Adresse
              </label>
              <input
                className={setInputStyle(address.hasError)}
                type="text"
                value={address.value}
                onBlur={address.valueBlurHandler}
                onChange={address.valueChangeHandler}
                placeholder="12 place Royale"
                name="address"
              />
            </div>
            <div className="flex flex-col gap-y-2 w-full">
              <label className="text-base-content/50" htmlFor="city">
                Ville
              </label>
              <input
                className={setInputStyle(city.hasError)}
                type="text"
                value={city.value}
                onBlur={city.valueBlurHandler}
                onChange={city.valueChangeHandler}
                placeholder="Paris"
                name="city"
              />
            </div>
            <div className="flex flex-col gap-y-2 w-full">
              <label className="text-base-content/50" htmlFor="postCode">
                Code Postal
              </label>
              <input
                className={setInputStyle(postCode.hasError)}
                type="text"
                value={postCode.value}
                onBlur={postCode.valueBlurHandler}
                onChange={postCode.valueChangeHandler}
                placeholder="75000"
                name="postCode"
              />
            </div>
            <div className="flex flex-col gap-y-2 w-full">
              <label className="text-base-content/50" htmlFor="phoneNumber">
                Téléphone
              </label>
              <input
                className={setInputStyle(phoneNumber.hasError)}
                type="text"
                value={phoneNumber.value}
                onBlur={phoneNumber.valueBlurHandler}
                onChange={phoneNumber.valueChangeHandler}
                placeholder="06 07 08 09 10"
                name="phoneNumber"
              />
            </div>
          </Wrapper>
        </div>
        <div className="w-full flex flex-col gap-y-4">
          <p className="text-xs px-2">
            Note : Les identifiants de l'utilisateur lui seront envoyés par mail
            à la validation du formulaire
          </p>
          <div className="w-full flex flex-col items-center gap-x-2 pr-2 mt-4">
            <p className={setErrorMessage()}>
              Un ou plusieurs champs sont mal remplis
            </p>
            {/*             <div className="flex gap-x-4">
              <button
                className="btn btn-outline btn-sm btn-primary font-normal w-32"
                type="reset"
                onClick={handleCloseDrawer}
              >
                Annuler
              </button>
              <button className="btn btn-primary btn-sm w-32">Valider</button>
            </div> */}
            <DrawerFormButtons onCancel={handleCloseDrawer} />
          </div>
        </div>
      </form>
    </div>
  );
};

export default UserQuickCreate;
