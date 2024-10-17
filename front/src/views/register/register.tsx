import { useCallback, useContext, useEffect, useState } from "react";
import { Context } from "../../store/context.store";
import FieldPassword from "../../components/UI/forms/field-password";
import { regexPassword } from "../../utils/constantes";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { BASE_URL } from "../../config/urls";
import useHttp from "../../hooks/use-http";
import image from "../../assets/images/andria-2.png";

export default function RegisterHome() {
  const { error, sendRequest } = useHttp();
  const nav = useNavigate();
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [isValid, setIsValid] = useState<{ p1: boolean; p2: boolean }>({
    p1: true,
    p2: true,
  });
  const [success, setSuccess] = useState(false);

  const { chooseTheme } = useContext(Context);
  const [searchParams] = useSearchParams();

  const checkToken = useCallback(() => {
    const applyData = (data: { success: boolean; message: string }) => {
      if (data.success) setSuccess(true);
    };
    sendRequest(
      {
        path: "/user/check-invitation",
        method: "post",
        body: { token: searchParams.get("id") ?? "" },
      },
      applyData,
    );
  }, [searchParams, sendRequest]);

  const handleSubmit = async () => {
    setIsValid({
      p1: regexPassword.test(password),
      p2: regexPassword.test(password2),
    });
    const response = await fetch(`${BASE_URL}/user/activate`, {
      method: "post",
      body: JSON.stringify({
        token: searchParams.get("id") ?? "toto ken",
        password,
      }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) nav("/");
  };

  const handleChangeP1 = (value: string) => {
    setIsValid({ ...isValid, p1: true });
    setPassword(value);
  };

  const handleChangeP2 = (value: string) => {
    setIsValid({ ...isValid, p2: true });
    setPassword2(value);
  };

  useEffect(() => {
    chooseTheme("winter", "light");
    checkToken();
  }, [checkToken, chooseTheme]);

  return (
    <main className="flex flex-col gap-y-8 place-items-center p-2">
      <img className="w-96 h-auto" src={image} alt="logo de l'application" />
      <h1 className="text-3xl font-bold">Activation du compte</h1>

      {error.length > 0 ? (
        <section className="flex flex-col gap-y-8 justify-center items-center">
          <p className="border boder-error rounded-md shadow-md text-error p-4">
            {error}
          </p>
          <Link className="btn btn-ourlined btn-primary" to="/">
            Retour
          </Link>
        </section>
      ) : (
        <>
          <section className="flex flex-col items-start gap-y-4">
            <FieldPassword
              value={password}
              onSetValue={handleChangeP1}
              match={password === password2}
              isValid={isValid.p1}
              name={password}
            />
            <FieldPassword
              value={password2}
              onSetValue={handleChangeP2}
              match={password === password2}
              isValid={isValid.p2}
              name={password2}
            />
            <div className="w-full flex justify-end">
              <button className="btn btn-primary" onClick={handleSubmit}>
                Valider
              </button>
            </div>
          </section>
          <section
            className={`w-72 text-xs justify-center p-4 border border-${isValid.p1 && isValid.p2 ? "primarty/20" : "error"} rounded-md ${isValid.p1 && isValid.p2 ? "" : "text-error"}`}
          >
            <p>Le mot de passe doit être composé d'au moins :</p>
            <ul className="pl-4 mt-2">
              <li>- 12 caractères</li>
              <li>- une majuscule</li>
              <li>- une minuscule</li>
              <li>- un nombre</li>
              <li>- un caractère spécial</li>
            </ul>
          </section>
          {/*         {success ? (
   <section>
     Vous allez être redirigé automatiquement vers la page de
     connexion...
   </section>
 ) : null} */}
        </>
      )}
    </main>
  );
}
