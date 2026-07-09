import FieldPassword from "./FieldPassword";

type Props = {
  onChange: (field: "password" | "password2", value: string) => void;
  password: string;
  password2: string;
  onSubmit: (event: React.FormEvent) => void;
  isValid: { p1: boolean; p2: boolean };
  submitLoader: boolean;
};

const PasswordUpdateForm = ({
  onChange,
  password,
  password2,
  onSubmit,
  isValid,
  submitLoader,
}: Props) => {
  return (
    <div className="flex flex-col items-center gap-y-4">
      <form
        className="flex flex-col items-start gap-y-4"
        onSubmit={onSubmit}
      >
        <FieldPassword
          label="Entrez votre mot de passe :"
          value={password}
          name="password"
          match={password === password2}
          isValid={isValid.p1}
          onChange={onChange}
        />
        <FieldPassword
          label="Confirmez votre mot de passe :"
          value={password2}
          name="password2"
          match={password === password2}
          isValid={isValid.p2}
          onChange={onChange}
        />
        <div className="w-full flex justify-end">
          <button
            type="submit"
            disabled={submitLoader}
            className="btn btn-primary"
          >
            {submitLoader ? (
              <>
                <span className="loading loading-spinner"></span>
                Enregistrement en cours...
              </>
            ) : (
              "Enregistrer"
            )}
          </button>
        </div>
      </form>
      <article
        className={`w-72 text-xs justify-center p-4 border ${
          isValid.p1 && isValid.p2
            ? "border-primary/20"
            : "border-error text-error"
        } rounded-md`}
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
};

export default PasswordUpdateForm;
