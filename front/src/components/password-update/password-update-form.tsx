import FieldPassword from "../UI/forms/field-password";
import SubmitButton from "../UI/submit-button";

type Props = {
  onHandleChange: (field: "password" | "password2", value: string) => void;
  password: string;
  password2: string;
  onHandleSubmit: (event: React.FormEvent) => void;
  isValid: { p1: boolean; p2: boolean };
  submitLoader: boolean;
};

export default function PasswordUpdateForm(props: Props) {
  return (
    <div className="flex flex-col items-center gap-y-4">
      <form
        className="flex flex-col items-start gap-y-4"
        onSubmit={props.onHandleSubmit}
      >
        <FieldPassword
          label="Entrez votre mot de passe :"
          value={props.password}
          onSetValue={props.onHandleChange}
          match={props.password === props.password2}
          isValid={props.isValid.p1}
          name="password"
        />
        <FieldPassword
          label="Confirmez votre mot de passe :"
          value={props.password2}
          onSetValue={props.onHandleChange}
          match={props.password === props.password2}
          isValid={props.isValid.p2}
          name="password2"
        />
        <div className="w-full flex justify-end">
          <SubmitButton
            isLoading={props.submitLoader}
            label="Enregistrer"
            loadingLabel="Enregistrement en cours..."
          />
        </div>
      </form>
      {/* Explication pour la saisie du mot de passe */}
      <article
        className={`w-72 text-xs justify-center p-4 border border-${props.isValid.p1 && props.isValid.p2 ? "primarty/20" : "error"} rounded-md ${props.isValid.p1 && props.isValid.p2 ? "" : "text-error"}`}
      >
        <p>Le mot de passe doit être composé d'au moins :</p>
        <ul className="pl-4 mt-2">
          <li>- 12 caractères</li>
          <li>- une majuscule</li>
          <li>- une minuscule</li>
          <li>- un nombre</li>
          <li>- un caractère spécial</li>
        </ul>
      </article>
    </div>
  );
}
