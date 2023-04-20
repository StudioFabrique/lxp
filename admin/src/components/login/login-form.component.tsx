import { FC, useState } from "react";
import useInput from "../../hooks/use-input";
import { regexMail, regexPassword } from "../../utils/constantes";
import PasswordVisible from "../UI/password-visible/password-visible";
import { Link } from "react-router-dom";

const LoginForm: FC<{
  onSubmit: (email: string, password: string) => void;
  isLoading: boolean;
  error: string;
}> = (props) => {
  const [inputType, setInputType] = useState("password");

  const { value: email } = useInput((value: string) =>
    regexMail.test(value.trim())
  );
  const { value: password } = useInput((value: string) =>
    regexPassword.test(value.trim())
  );

  let formIsValid = false;
  formIsValid = email.isValid && password.isValid;

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    if (formIsValid) {
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

  const loginErrorClass =
    props.error.length > 0 ? "visible text-xs text-error" : "invisible text-xs";

  const isLoadingButtonComponent = props.isLoading ? (
    <button className="btn loading normal-case bg-pink-900 p-3 rounded-md pr-6 pl-6 text-white text-[8pt]">
      Connexion en cours
    </button>
  ) : (
    <button className="btn normal-case bg-pink-900 p-3 rounded-md pr-6 pl-6 text-white text-[8pt]">
      Je me connecte
    </button>
  );

  return (
    <form className="w-[70%] flex flex-col gap-y-4" onSubmit={submitHandler}>
      <p className="text-[14pt] font-bold">Se connecter</p>
      {/* input 1 */}
      <input
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

      <p className={loginErrorClass}>{props.error}</p>

      <div className="flex justify-between items-center mt-3">
        <Link to="#" className="ml-2 text-[8pt]">
          Mot de passe oublié?
        </Link>
        {isLoadingButtonComponent}
      </div>
    </form>
  );
};

export default LoginForm;
