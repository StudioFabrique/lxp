import { FC, useState } from "react";
import useInput from "../../hooks/use-input";
import { regexMail, regexPassword } from "../../utils/constantes";
import PasswordVisible from "../UI/password-visible/password-visible";
import { setLoginFormClasses } from "../../utils/setLoginFormClasses";
import { Link } from "react-router-dom";

const LoginForm: FC<{
  onSubmit: (email: string, password: string) => void;
  isLoading: boolean;
  error: string;
}> = (props) => {
  const [inputType, setInputType] = useState("password");

  const { value: email } = useInput(
    (value: string) => value.length < 1 || regexMail.test(value)
  );
  const { value: password } = useInput(
    (value: string) => value.length < 1 || regexPassword.test(value.trim())
  );

  let formIsValid = false;
  formIsValid = email.isValid && password.isValid;

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    if (
      formIsValid &&
      email.value.trim().length > 0 &&
      password.value.trim().length > 0
    ) {
      props.onSubmit(email.value.trim(), password.value.trim());
      console.log("bonjour form");
    }
  };

  const handlePasswordVisibility = () => {
    if (inputType === "password") {
      setInputType("text");
    } else {
      setInputType("password");
    }
  };

  const isLoadingButtonComponent = props.isLoading ? (
    <button className="btn loading normal-case bg-pink p-3 rounded-md pr-6 pl-6 text-white text-[8pt]" />
  ) : (
    <button className="btn normal-case bg-pink p-3 rounded-md pr-6 pl-6 text-white text-[8pt]">
      Je me connecte
    </button>
  );

  return (
    <>
      <form className="w-[70%] flex flex-col gap-y-4" onSubmit={submitHandler}>
        <p className="text-[14pt] font-bold">Se connecter</p>
        {/* input 1 */}
        <input
          className={setLoginFormClasses(email.hasError)}
          type="text"
          value={email.value}
          onChange={email.valueChangeHandler}
          onBlur={email.valueBlurHandler}
          placeholder="Identifiant"
        />
        <span className="flex">
          {/* input 2 */}
          <span className=" w-full relative">
            <input
              className={setLoginFormClasses(password.hasError)}
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
          <Link to="#" className="ml-2 text-[8pt]">
            Mot de passe oublié?
          </Link>
          {isLoadingButtonComponent}
        </div>
      </form>
    </>
  );
};

export default LoginForm;
