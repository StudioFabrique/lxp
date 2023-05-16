import { FC, FormEvent } from "react";
import { LoadingButton } from "../../UI/loading-button/loading-button.component";
import useInput from "../../../hooks/use-input";
import { regexMail, regexPassword } from "../../../utils/constantes";

const UserAddForm: FC<{
  user?: any;
  onSubmitForm: (user: any) => void;
  error: string;
  isLoading: boolean;
}> = (props) => {
  const { value: email } = useInput(
    (value: string) => regexMail.test(value),
    props.user?.email ?? ""
  );

  const { value: password } = useInput(
    (value: string) => regexPassword.test(value),
    props.user?.password ?? ""
  );

  const { value: firstname } = useInput(
    (value: string) => regexPassword.test(value),
    props.user?.firstname ?? ""
  );

  const { value: lastname } = useInput(
    (value: string) => regexPassword.test(value),
    props.user?.lastname ?? ""
  );

  const { value: address } = useInput(
    (value: string) => regexPassword.test(value),
    props.user?.address ?? ""
  );

  const { value: postCode } = useInput(
    (value: string) => regexPassword.test(value),
    props.user?.postCode ?? ""
  );

  const { value: city } = useInput(
    (value: string) => regexPassword.test(value),
    props.user?.city ?? ""
  );

  //  test la validité du form via le custom hook useInput
  let formIsValid = false;
  formIsValid = email.isValid && password.isValid;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formIsValid) {
      props.onSubmitForm({
        email: email.value.trim(),
        password: password.value.trim(),
        firstname: firstname.value.trim(),
        lastname: lastname.value.trim(),
        address: address.value.trim(),
        postCode: postCode.value.trim(),
        city: city.value.trim(),
      });
    }
  };

  return (
    <form
      className="flex flex-col items-center gap-y-6"
      onSubmit={handleSubmit}
      autoComplete="off"
    >
      <div className="h-full flex flex-col justify-center gap-y-4">
        <span className="flex flex-col justify-between">
          <label>Email</label>
          <input
            className="ml-2 rounded-xs bg-pink-900/10 outline-pink-900/20 p-[20px] pl-[30px] placeholder:text-purple-discrete"
            type="text"
            onChange={email.valueChangeHandler}
            onBlur={email.valueBlurHandler}
            defaultValue={email.value}
            autoComplete="off"
          />
        </span>
        <span className="flex flex-col justify-between">
          <label>Mot de passe</label>
          <input
            className="ml-2 rounded-xs bg-pink-900/10 outline-pink-900/20 p-[20px] pl-[30px] placeholder:text-purple-discrete"
            type="password"
            onChange={password.valueChangeHandler}
            onBlur={email.valueBlurHandler}
            defaultValue={password.value}
            autoComplete="off"
          />
        </span>
      </div>
      <div className="flex gap-x-14">
        <div className="h-full flex flex-col gap-y-4">
          <span className="flex flex-col justify-between">
            <label>Prénom</label>
            <input
              className="ml-2 rounded-xs bg-pink-900/10 outline-pink-900/20 p-[20px] pl-[30px] placeholder:text-purple-discrete"
              name="firstname"
              type="text"
              onChange={firstname.valueChangeHandler}
              onBlur={email.valueBlurHandler}
              defaultValue={firstname.value}
            />
          </span>
          <span className="flex flex-col justify-between">
            <label>Nom</label>
            <input
              className="ml-2 rounded-xs bg-pink-900/10 outline-pink-900/20 p-[20px] pl-[30px] placeholder:text-purple-discrete"
              name="lastname"
              type="text"
              onChange={lastname.valueChangeHandler}
              onBlur={email.valueBlurHandler}
              defaultValue={lastname.value}
            />
          </span>
        </div>
        <div className="h-full flex flex-col gap-y-4">
          <span className="flex flex-col justify-between">
            <label>Adresse</label>
            <input
              className="ml-2 rounded-xs bg-pink-900/10 outline-pink-900/20 p-[20px] pl-[30px] placeholder:text-purple-discrete"
              name="address"
              type="text"
              onChange={address.valueChangeHandler}
              onBlur={email.valueBlurHandler}
              defaultValue={address.value}
            />
          </span>
          <span className="flex flex-col justify-between">
            <label>Code Postal</label>
            <input
              className="ml-2 rounded-xs bg-pink-900/10 outline-pink-900/20 p-[20px] pl-[30px] placeholder:text-purple-discrete"
              name="postCode"
              type="text"
              onChange={postCode.valueChangeHandler}
              onBlur={email.valueBlurHandler}
              defaultValue={postCode.value}
            />
          </span>
          <span className="flex flex-col justify-between">
            <label>Ville</label>
            <input
              className="ml-2 rounded-xs bg-pink-900/10 outline-pink-900/20 p-[20px] pl-[30px] placeholder:text-purple-discrete"
              name="city"
              type="text"
              onChange={city.valueChangeHandler}
              onBlur={email.valueBlurHandler}
              defaultValue={city.value}
            />
          </span>
        </div>
      </div>
      <div className="h-full flex flex-col justify-center">
        <p>{props.error}</p>
        <LoadingButton
          isLoading={props.isLoading}
          error={props.error}
          label="Enregistrer"
          loadingLabel="Enregistrement en cours"
        />
      </div>
    </form>
  );
};

export default UserAddForm;
