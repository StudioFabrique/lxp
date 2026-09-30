import useActivationKey from "../hooks/useActivationKey";
import { zodResolver } from "@hookform/resolvers/zod";
import { activationTokenSchema } from "../auth.schema";
import { useForm } from "react-hook-form";
import { useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { onboardingApi } from "../api/onboarding.api";
import AuthPageWrapper from "./AuthPageWrapper";

type Props = {
  onNext: (token: string) => void;
  onPrevious: () => void;
};

type TokenFormValues = {
  token: string;
};

const TokenForm = ({ onNext, onPrevious }: Props) => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const tokenInputRef = useRef<HTMLInputElement>(null);
  const {
    command,
    activationTokenTtlMinutes,
    isCommandCopied,
    handleCopyCommand,
  } = useActivationKey();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TokenFormValues>({
    resolver: zodResolver(activationTokenSchema),
    defaultValues: { token: "" },
    shouldFocusError: false,
  });

  const tokenField = register("token", {
    onChange: () => setError(""),
  });

  const focusInvalidToken = () => {
    tokenInputRef.current?.focus({ preventScroll: true });
  };

  const onSubmit = async (data: TokenFormValues) => {
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

  return (
    <AuthPageWrapper
      variant="setup"
      title="Activer le compte root"
      description="Cette clé sécurise la création du compte qui gérera l’identité et les paramètres de votre instance."
    >
      <form
        onSubmit={(event) => {
          void handleSubmit(onSubmit, focusInvalidToken)(event);
        }}
        className="flex flex-1 flex-col gap-4"
      >
        <div className="form-control w-full">
          <input
            type="text"
            placeholder="Clé d'activation"
            autoComplete="off"
            style={{ WebkitTextSecurity: "disc" } as React.CSSProperties}
            {...tokenField}
            ref={(element) => {
              tokenField.ref(element);
              tokenInputRef.current = element;
            }}
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

        <div className="group collapse collapse-arrow rounded-lg bg-base-200">
          <input type="checkbox" />
          <div className="collapse-title text-sm font-medium text-warning/60 group-hover:text-warning/80">
            Vous ne trouvez pas la clé d'activation ?
          </div>
          <div className="collapse-content">
            <p className="text-sm mb-2 text-base-content/60">
              Vous pouvez régénérer une nouvelle clé d'activation en exécutant
              la commande suivante sur le serveur :
            </p>
            <div className="flex items-center gap-2 bg-base-300 rounded-lg p-2">
              <textarea
                readOnly
                value={command}
                aria-label="Commande de génération de la clé d'activation"
                className="textarea min-h-0 min-w-0 flex-1 resize-none overflow-hidden border-none bg-transparent px-1 py-1 font-mono text-xs leading-5 text-base-content focus:outline-none field-sizing-content"
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
              pendant{" "}
              {activationTokenTtlMinutes >= 60
                ? `${activationTokenTtlMinutes / 60} heures`
                : `${activationTokenTtlMinutes} minutes`}
              .
            </p>
          </div>
        </div>
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-base-300 pt-4">
          <button
            type="button"
            onClick={onPrevious}
            disabled={isLoading}
            className="btn btn-ghost text-base normal-case"
          >
            Précédent
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary rounded-lg text-base normal-case text-base-100"
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
        </div>
      </form>
    </AuthPageWrapper>
  );
};

export default TokenForm;
