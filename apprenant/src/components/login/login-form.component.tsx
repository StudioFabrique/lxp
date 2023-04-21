import { Dispatch, FC, SetStateAction, useState } from "react";
import useInput from "../../hooks/use-input";
import { regexMail, regexPassword } from "../../utils/constantes";
import PasswordVisible from "../UI/password-visible/password-visible";
import FadeWrapper from "../UI/FadeWrapper/FadeWrapper";

const LoginForm: FC<{
  onSubmit: (email: string, password: string) => void;
  isLoading: boolean;
  error: string;
  setResetPasswordState: Dispatch<SetStateAction<boolean>>;
}> = (props) => {
  const [inputType, setInputType] = useState("password");

  const { value: email } = useInput((value: string) => regexMail.test(value));
  const { value: password } = useInput((value: string) =>
    regexPassword.test(value.trim())
  );

  let formIsValid = false;
  formIsValid = email.isValid && password.isValid;

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    if (formIsValid) {
      props.onSubmit(email.value.trim(), password.value.trim());
    }
  };

  const handleClickFormChange = (e: React.MouseEvent) => {
    e.preventDefault();
    props.setResetPasswordState(true);
  };

  const handlePasswordVisibility = () => {
    if (inputType === "password") {
      setInputType("text");
    } else {
      setInputType("password");
    }
  };

  const isLoadingButtonComponent = props.isLoading ? (
    <button
      type="submit"
      className="submit btn loading normal-case bg-pink-900 p-3 rounded-md pr-6 pl-6 text-white text-[8pt]"
    >
      Connexion
    </button>
  ) : (
    <button
      type="submit"
      className="submit btn normal-case bg-pink-900 p-3 rounded-md pr-6 pl-6 text-white text-[8pt]"
    >
      Je me connecte
    </button>
  );

  return (
    <FadeWrapper>
      <form
        className="loginForm w-[70%] flex flex-col gap-y-4"
        onSubmit={submitHandler}
      >
        <label className="text-[14pt] font-bold">Se connecter</label>
        {/* input 1 */}
        <input
          name="username"
          className="rounded-xs bg-pink-900/10 outline-pink-900/20 p-[20px] pl-[30px] w-full placeholder:text-purple-discrete"
          type="text"
          value={email.value}
          onChange={email.valueChangeHandler}
          onBlur={email.valueBlurHandler}
          placeholder="Identifiant"
        />
        <span className="flex">
          {/* input 2 */}
          <span className="w-full relative">
            <input
              name="password"
              className="rounded-xs bg-pink-900/10 outline-pink-900/20 p-[20px] pl-[30px] w-full placeholder:text-purple-discrete"
              type={inputType}
              placeholder="Mot de passe"
              onBlur={password.valueBlurHandler}
              onChange={password.valueChangeHandler}
            />
            <PasswordVisible
              inputType={inputType}
              onPasswordVisibility={handlePasswordVisibility}
            />
          </span>
        </span>

        <div className="flex flex-row justify-between mt-3">
          <button
            type="button"
            onClick={handleClickFormChange}
            className="ml-2 text-[8pt]"
          >
            Mot de passe oublié?
          </button>
          {isLoadingButtonComponent}
        </div>
      </form>
    </FadeWrapper>
  );
};

export default LoginForm;
