import { FC, FormEvent } from "react";
import { Add } from "./buttons";
import useInput from "../../../hooks/use-input";
import { regexMail, regexPassword } from "../../../utils/constantes";

const UserAddForm: FC<{
  onSubmit: (user: any) => void;
  error: string;
  isLoading: boolean;
  /* user?: any */
}> = (props) => {
  const { value: email } = useInput((value: string) =>
    regexMail.test(value.trim())
  );

  const { value: password } = useInput((value: string) =>
    regexPassword.test(value.trim())
  );

  const { value: firstname } = useInput((value: string) =>
    regexPassword.test(value.trim())
  );

  const { value: lastname } = useInput((value: string) =>
    regexPassword.test(value.trim())
  );

  const { value: address } = useInput((value: string) =>
    regexPassword.test(value.trim())
  );

  const { value: postCode } = useInput((value: string) =>
    regexPassword.test(value.trim())
  );

  const { value: city } = useInput((value: string) =>
    regexPassword.test(value.trim())
  );

  //  test la validité du form via le custom hook useInput
  let formIsValid = false;
  formIsValid = email.isValid && password.isValid;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formIsValid) {
      props.onSubmit({
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
    >
      <label>Email :</label>
      <input
        name="email"
        type="text"
        onChange={email.valueChangeHandler}
        onBlur={email.valueBlurHandler}
        value={email.value}
      />
      <label>Mot de passe :</label>
      <input
        name="password"
        type="password"
        onChange={password.valueChangeHandler}
        onBlur={email.valueBlurHandler}
        value={password.value}
      />
      <label>Prénom :</label>
      <input
        name="firstname"
        type="text"
        onChange={firstname.valueChangeHandler}
        onBlur={email.valueBlurHandler}
        value={firstname.value}
      />
      <label>Nom :</label>
      <input
        name="lastname"
        type="text"
        onChange={lastname.valueChangeHandler}
        onBlur={email.valueBlurHandler}
        value={lastname.value}
      />
      <label>Adresse :</label>
      <input
        name="address"
        type="text"
        onChange={address.valueChangeHandler}
        onBlur={email.valueBlurHandler}
        value={address.value}
      />
      <label>Code Postal :</label>
      <input
        name="postCode"
        type="text"
        onChange={postCode.valueChangeHandler}
        onBlur={email.valueBlurHandler}
        value={postCode.value}
      />
      <label>Ville</label>
      <input
        name="city"
        type="text"
        onChange={city.valueChangeHandler}
        onBlur={email.valueBlurHandler}
        value={city.value}
      />
      <p>{props.error}</p>
      <Add isLoading={props.isLoading} />
    </form>
  );
};

export default UserAddForm;
