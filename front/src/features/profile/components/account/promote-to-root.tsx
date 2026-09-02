import { FormEvent, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Wrapper from "../../../../components/wrappers/BoxWrapper";
import { AuthContext } from "../../../../store/AuthProvider";
import { profileApi } from "../../api/profile.api";
import { onboardingApi } from "../../../auth/api/onboarding.api";
import { getApiErrorMessage } from "../../../../utils/helpers/api-error-message";
import { Check, Copy } from "lucide-react";

const LOCAL_COMMAND = "npm run generate-activation-key";

/**
 * Commande à exécuter sur le serveur pour régénérer la clé.
 *
 * En production, `docker compose` n'est pas utilisable : les fichiers compose
 * et le `.env` restent sur la machine de déploiement, jamais sur le serveur,
 * pour ne pas y laisser les secrets en clair. `docker exec` n'a lui besoin que
 * de l'identifiant du conteneur, que l'API se procure par son propre `hostname`
 * et sert tant qu'aucun administrateur n'existe.
 */
const activationKeyCommand = (containerId?: string) => {
  if (!import.meta.env.PROD) return LOCAL_COMMAND;
  return `docker exec ${containerId ?? "<conteneur>"} ${LOCAL_COMMAND}`;
};

const PromoteToRoot = () => {
  const { handshake } = useContext(AuthContext);
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activationTokenTtlMinutes, setActivationTokenTtlMinutes] =
    useState(30);
  const [isCommandCopied, setIsCommandCopied] = useState(false);
  const [containerId, setContainerId] = useState<string>();

  const command = activationKeyCommand(containerId);

  const handleCopyCommand = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setIsCommandCopied(true);
      window.setTimeout(() => setIsCommandCopied(false), 2000);
    } catch (error) {
      console.error("Échec de la copie de la commande :", error);
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedToken = token.trim();
    if (!normalizedToken) {
      toast.error("La clé d'activation est requise.");
      return;
    }

    setIsLoading(true);
    try {
      const response =
        await profileApi.mutations.promoteToRoot(normalizedToken);
      await handshake();
      setToken("");
      toast.success(response.message);
    } catch (error: unknown) {
      toast.error(
        getApiErrorMessage(error, "Impossible d'attribuer le rôle root."),
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    onboardingApi
      .getSetupStatus()
      .then((status) => {
        if (active) {
          setContainerId(status.containerId);
          setActivationTokenTtlMinutes(status.activationTokenTtlMinutes);
        }
      })
      // Sans identifiant, la commande reste affichée avec un emplacement à
      // compléter : mieux qu'une commande fausse ou pas de commande du tout.
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="flex flex-col gap-2 mt-10">
      <h3 className="text-lg font-semibold">Devenir utilisateur root</h3>
      <Wrapper>
        <form onSubmit={onSubmit} className="flex max-w-xl flex-col gap-4">
          <p className="text-sm text-base-content/70">
            Générez une clé sur le serveur avec la commande
            <code className="mx-1 rounded bg-base-300 px-1.5 py-0.5">
              {activationKeyCommand()}
            </code>
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
            puis saisissez-la ci-dessous. La clé est valable
            {activationTokenTtlMinutes >= 60
              ? `${activationTokenTtlMinutes / 60} heures`
              : `${activationTokenTtlMinutes} minutes`}{" "}
            et ne peut être utilisée qu'une fois.
          </p>
          <input
            type="password"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            placeholder="Clé d'activation"
            autoComplete="off"
            aria-label="Clé d'activation root"
            className="input w-full bg-base-200"
          />
          <button type="submit" disabled={isLoading} className="btn w-fit">
            {isLoading ? (
              <span className="loading loading-spinner loading-sm" />
            ) : null}
            Devenir root
          </button>
        </form>
      </Wrapper>
    </div>
  );
};

export default PromoteToRoot;
