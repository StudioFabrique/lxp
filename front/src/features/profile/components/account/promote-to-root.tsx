import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { activationTokenSchema } from "../../../auth/auth.schema";
import { useFormField } from "../../../../components/form/useFormField";
import { showFormErrors } from "../../../../components/form/form-errors";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import BoxWrapper from "../../../../components/wrappers/BoxWrapper";
import { AuthContext } from "../../../../store/AuthProvider";
import { profileApi } from "../../api/profile.api";
import useActivationKey from "../../../auth/hooks/useActivationKey";
import { getApiErrorMessage } from "../../../../utils/helpers/api-error-message";
import { LoaderCircle, Check, Copy } from "lucide-react";
import QuestionMarkTooltip from "../../../../components/UI/question-mark-tooltip/question-mark-tooltip";
import Modal from "../../../../components/UI/modal/modal";
import { ROOT_ACCOUNT_POLICY } from "../../../auth/root-account-policy";

const PromoteToRoot = () => {
  const { handshake } = useContext(AuthContext);
  const [isModalOpen, setModalOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(activationTokenSchema),
    defaultValues: { token: "" },
  });
  const [token, setToken] = useFormField(form, "token");
  const [isLoading, setIsLoading] = useState(false);
  const {
    command,
    activationTokenTtlMinutes,
    isCommandCopied,
    handleCopyCommand,
  } = useActivationKey();

  const handleOpenModal = form.handleSubmit(
    () => setModalOpen(true),
    showFormErrors,
  );

  const onPromote = async () => {
    if (!(await form.trigger())) return;
    const normalizedToken = activationTokenSchema.parse(form.getValues()).token;

    setIsLoading(true);
    try {
      const response =
        await profileApi.mutations.promoteToRoot(normalizedToken);
      await handshake();
      setToken("");
      setModalOpen(false);
      toast.success(response.message);
    } catch (error: unknown) {
      toast.error(
        getApiErrorMessage(error, "Impossible d'attribuer le rôle root."),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 mt-10">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold">Devenir utilisateur root</h3>
        <QuestionMarkTooltip tooltipValue={ROOT_ACCOUNT_POLICY} />
      </div>
      <BoxWrapper>
        <form
          onSubmit={handleOpenModal}
          className="flex max-w-xl flex-col gap-4"
        >
          <p className="text-sm text-base-content/70">
            Générez une clé sur le serveur avec la commande
            <code className="mx-1 rounded bg-base-300 px-1.5 py-0.5">
              {command}
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
            puis saisissez-la ci-dessous. La clé est valable{" "}
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
              <LoaderCircle className="size-4 animate-spin" />
            ) : null}
            Devenir root
          </button>
        </form>
      </BoxWrapper>
      {isModalOpen ? (
        <Modal
          title="Confirmer le changement d’utilisateur root"
          leftLabel="Annuler"
          onLeftClick={() => setModalOpen(false)}
          rightLabel="Devenir root"
          onRightClick={() => void onPromote()}
          rightClassName="btn-warning"
          isSubmitting={isLoading}
        >
          <p className="mt-4 text-sm leading-relaxed text-base-content/70">
            Vous allez devenir l’unique utilisateur root de l’application.
            L’utilisateur root actuel, s’il existe, sera rétrogradé en
            administrateur et perdra ses droits root. Confirmez-vous cette
            action ?
          </p>
        </Modal>
      ) : null}
    </div>
  );
};

export default PromoteToRoot;
