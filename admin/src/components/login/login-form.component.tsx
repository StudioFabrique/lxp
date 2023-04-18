import { FC, useState } from "react";
import useInput from "../../hooks/use-input";
import { regexMail, regexPassword } from "../../utils/constantes";
import PasswordVisible from "../UI/password-visible/password-visible";
import { setClasses } from "../../utils/formClasses";

const LoginForm: FC<{
  onSubmit: (email: string, password: string) => void;
  isLoading: boolean;
  error: string;
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

  return (
    <>
      <form className="w-full" onSubmit={submitHandler}>
        <h3 className="mb-4 text-xl text-base-content font-bold tracking-widest">
          Se Connecter
        </h3>
        <div className="flex flex-col  gap-y-12">
          <div className="w-4/6 flex flex-col gap-y-1">
            <input
              className={setClasses(email.hasError)}
              type="text"
              id="email"
              value={email.value}
              onBlur={email.valueBlurHandler}
              onChange={email.valueChangeHandler}
              placeholder="Identifiant"
            />
            {email.hasError && (
              <p className="pl-4 text-xs text-error">Adresse email invalide</p>
            )}
          </div>
          <div className="flex flex-col gap-y-1">
            <span className="w-4/6 flex items-center gap-x-2 relative">
              <input
                className={setClasses(password.hasError)}
                type={inputType}
                id="password"
                value={password.value}
                onBlur={password.valueBlurHandler}
                onChange={password.valueChangeHandler}
                placeholder="Mot de passe"
              />
              <PasswordVisible
                inputType={inputType}
                onPasswordVisibility={handlePasswordVisibility}
              />
            </span>
            {password.hasError && (
              <p className="pl-4 text-xs text-error">Mot de passe invalide</p>
            )}
          </div>
        </div>
        {props.error && (
          <p className="font-bold pl-4 text-error text-sm mt-4">
            {props.error}
          </p>
        )}
        <div className="w-4/6 flex justify-between items-center mt-12">
          <p className="font-normal text-xs">Mot de passe oublié ?</p>
          {!props.isLoading ? (
            <button className="btn btn-primary text-xs" type="submit">
              Je me connecte
            </button>
          ) : (
            <button className="btn btn-primary text-xs loading" type="submit">
              Connexion
            </button>
          )}
        </div>
      </form>
    </>
  );
};

export default LoginForm;
