import { useContext, useState } from "react";
import { regexMail, regexPassword } from "../../../config/constantes";
import { Link } from "react-router";
import useInput from "../../../hooks/useInput";
import { AuthContext } from "../../../store/AuthProvider";
import PasswordVisibilityToggle from "../components/PasswordVisibilityToggle";

const Login = () => {
  const { isLoading, error, login } = useContext(AuthContext);

  const handleSubmit = (email: string, password: string) => {
    login(email, password);
  };

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
      handleSubmit(email.value.trim(), password.value.trim());
    }
  };

  const handlePasswordVisibility = () => {
    setInputType((prev) => (prev === "password" ? "text" : "password"));
  };

  return (
    <form className="flex flex-col flex-1" onSubmit={submitHandler}>
      <div className="flex flex-col gap-4 my-auto">
        {/* Titre */}
        <h1 className="font-bold text-2xl text-base-content mb-2 text-center">
          Connectez-vous à votre espace
        </h1>

        {/* Champ email */}
        <div className="form-control w-full">
          <input
            name="email"
            type="email"
            value={email.value}
            onChange={email.valueChangeHandler}
            onBlur={email.valueBlurHandler}
            placeholder="Adresse mail"
            className="input input-lg text-sm px-5 w-full bg-base-200 text-base-content placeholder-base-content/50 border-none focus:outline-none focus:ring-2 focus:ring-primary rounded-lg"
          />
        </div>

        {/* Champ mot de passe */}
        <div className="form-control w-full relative">
          <input
            name="password"
            type={inputType}
            value={password.value}
            onChange={password.valueChangeHandler}
            onBlur={password.valueBlurHandler}
            placeholder="Mot de passe"
            className="input input-lg text-sm px-5 w-full bg-base-200 text-base-content placeholder-base-content/50 border-none focus:outline-none focus:ring-2 focus:ring-primary rounded-lg pr-12"
          />
          <div className="absolute right-1 top-1/2 -translate-y-1/2 cursor-pointer flex items-center">
            <PasswordVisibilityToggle
              inputType={inputType}
              onPasswordVisibility={handlePasswordVisibility}
            />
          </div>
        </div>

        {/* Message d'erreur */}
        {error && <span className="text-sm text-error -mt-2.5">{error}</span>}

        {/* Bouton de soumission */}
        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary w-full text-base-100 rounded-lg mt-2 normal-case text-base"
        >
          {isLoading ? (
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
            className="text-sm text-base-content hover:underline transition-all"
          >
            Mot de passe oublié ?
          </Link>
        </div>
      </div>
    </form>
  );
};

export default Login;
