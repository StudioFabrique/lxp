import { FC, useState } from "react";
import { Link } from "react-router-dom";
import useInput from "../../hooks/use-input";
import { regexMail, regexPassword } from "../../utils/constantes";
import PasswordVisible from "../UI/password-visible/password-visible";

const LoginForm: FC<{
  onSubmit: (email: string, password: string) => void;
  isLoading: boolean;
  error: string;
}> = (props) => {
  const [inputType, setInputType] = useState("password");

  const { value: email } = useInput((value: string) =>
    regexMail.test(value.trim()),
  );
  const { value: password } = useInput((value: string) =>
    regexPassword.test(value.trim()),
  );

  let formIsValid = false;
  formIsValid = email.isValid && password.isValid;

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    if (formIsValid) {
      props.onSubmit(email.value.trim(), password.value.trim());
    }
  };

  const handlePasswordVisibility = () => {
    setInputType((prev) => (prev === "password" ? "text" : "password"));
  };

  return (
    <form className="flex flex-col flex-1 w-full" onSubmit={submitHandler}>
      <div className="flex flex-col gap-4 my-auto w-full">
        <h1 className="text-xl font-bold text-black mb-2">
          Connectez-vous à votre espace
        </h1>

        <div className="form-control w-full">
          <input
            name="email"
            type="email"
            value={email.value}
            onChange={email.valueChangeHandler}
            onBlur={email.valueBlurHandler}
            placeholder="Adresse mail"
            className="input input-lg text-sm px-5 w-full bg-[#EAEAF0] text-black placeholder-gray-500 border-none focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-lg"
          />
        </div>

        <div className="form-control w-full relative">
          <input
            name="password"
            type={inputType}
            value={password.value}
            onChange={password.valueChangeHandler}
            onBlur={password.valueBlurHandler}
            placeholder="Mot de passe"
            className="input input-lg text-sm px-5 w-full bg-[#EAEAF0] text-black placeholder-gray-500 border-none focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-lg pr-12"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 flex items-center">
            <PasswordVisible
              inputType={inputType}
              onPasswordVisibility={handlePasswordVisibility}
            />
          </div>
        </div>

        {props.error && (
          <span className="text-sm text-red-500 mt-[-10px]">{props.error}</span>
        )}

        <button
          type="submit"
          disabled={props.isLoading}
          className="btn w-full bg-black hover:bg-gray-800 text-white border-none rounded-lg mt-2 normal-case text-base disabled:bg-gray-400 disabled:text-white"
        >
          {props.isLoading ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Connexion...
            </>
          ) : (
            "Se connecter"
          )}
        </button>

        <div className="text-center mt-2">
          <Link
            to="/reset-password"
            className="text-sm text-black hover:underline transition-all"
          >
            Mot de passe oublié ?
          </Link>
        </div>
      </div>

      <div className="mt-auto flex justify-center w-full pt-6">
        <button
          type="button"
          className="text-sm text-gray-700 hover:text-black transition-colors"
        >
          Besoin d'aide ?
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
