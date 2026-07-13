import { useForm } from "react-hook-form";
import { useState } from "react";
import { onboardingApi } from "../api/onboarding.api";

type Props = {
  onNext: (token: string) => void;
};

type FormData = {
  token: string;
};

const TokenForm = ({ onNext }: Props) => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { token: "" },
  });

  const onSubmit = async (data: FormData) => {
    setError("");
    setIsLoading(true);
    try {
      await onboardingApi.verifyActivationToken(data.token.trim());
      onNext(data.token.trim());
    } catch (err: any) {
      const message =
        err.response?.data?.message ??
        "Une erreur est survenue. Veuillez réessayer.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 my-auto">
      <h1 className="font-bold text-xl text-base-content text-center">
        Création du premier administrateur
      </h1>

      <p className="text-sm text-base-content/70 text-center">
        Veuillez renseigner la clé d'activation pour créer votre premier
        utilisateur.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="form-control w-full">
          <input
            type="text"
            placeholder="Clé d'activation"
            {...register("token", {
              required: "La clé d'activation est requise.",
            })}
            className="input input-lg text-sm px-5 w-full bg-base-200 text-base-content placeholder-base-content/50 border-none focus:outline-none focus:ring-2 focus:ring-primary rounded-lg"
          />
          {errors.token && (
            <span className="text-xs text-error mt-1">
              {errors.token.message}
            </span>
          )}
        </div>

        {error && (
          <span className="text-sm text-error text-center">{error}</span>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary w-full text-base-100 rounded-lg normal-case text-base"
        >
          {isLoading ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Vérification...
            </>
          ) : (
            "Valider"
          )}
        </button>
      </form>

      <div className="group collapse collapse-arrow bg-base-200 rounded-lg">
        <input type="checkbox" />
        <div className="collapse-title text-sm font-medium text-warning/60 group-hover:text-warning/80">
          Vous ne trouvez pas la clé d'activation ?
        </div>
        <div className="collapse-content">
          <p className="text-sm mb-2 text-base-content/60">
            Vous pouvez régénérer une nouvelle clé d'activation en exécutant la
            commande suivante sur le serveur :
          </p>
          <code className="block bg-base-300 rounded-lg p-3 text-xs text-base-content select-all">
            docker exec -it lxp npm run generate-activation-key
          </code>
          <p className="text-xs text-base-content/50 mt-4">
            La nouvelle clé s'affichera dans le terminal. Elle est valide
            pendant 30 minutes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TokenForm;
