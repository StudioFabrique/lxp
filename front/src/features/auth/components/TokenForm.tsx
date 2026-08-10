import { useForm } from "react-hook-form";
import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { onboardingApi } from "../api/onboarding.api";

const ACTIVATION_KEY_COMMAND = import.meta.env.PROD
  ? "docker compose exec app npm run generate-activation-key"
  : "npm run generate-activation-key";

type Props = {
  onNext: (token: string) => void;
};

type FormData = {
  token: string;
};

const TokenForm = ({ onNext }: Props) => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCommandCopied, setIsCommandCopied] = useState(false);

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
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Une erreur est survenue. Veuillez réessayer.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCommand = async () => {
    try {
      await navigator.clipboard.writeText(ACTIVATION_KEY_COMMAND);
      setIsCommandCopied(true);
      window.setTimeout(() => setIsCommandCopied(false), 2000);
    } catch (error) {
      console.error("Échec de la copie de la commande :", error);
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
            autoComplete="off"
            style={{ WebkitTextSecurity: "disc" } as React.CSSProperties}
            {...register("token", {
              required: "La clé d'activation est requise.",
              onChange: () => setError(""),
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
          <span className="text-sm text-error text-center">
            Une erreur est survenue. Veuillez vérifier votre clé d'activation et
            réessayer.
          </span>
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
          <div className="flex items-center gap-2 bg-base-300 rounded-lg p-2">
            <textarea
              readOnly
              value={ACTIVATION_KEY_COMMAND}
              rows={1}
              aria-label="Commande de génération de la clé d'activation"
              className="textarea min-w-0 flex-1 resize-none overflow-hidden border-none bg-transparent px-1 py-1 font-mono text-xs leading-5 text-base-content focus:outline-none field-sizing-content"
            />
            <button
              type="button"
              onClick={handleCopyCommand}
              className="btn btn-xs self-start btn-ghost shrink-0 gap-1 text-base-content/60 hover:text-base-content"
              aria-label="Copier la commande"
              title="Copier la commande"
            >
              {isCommandCopied ? (
                <Check className="size-3.5 text-success" />
              ) : (
                <Copy className="size-3.5" />
              )}
              <span className="hidden sm:inline">
                {isCommandCopied ? "Copié" : ""}
              </span>
            </button>
          </div>
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
