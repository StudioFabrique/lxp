import { Mail, Send } from "lucide-react";
import { useId } from "react";
import { cn } from "../../../../utils/cn";

type UserInvitationCardProps = {
  sendEmail: boolean;
  onSetSendEmail: (value: boolean) => void;
  disabled?: boolean;
  compact?: boolean;
};

export default function UserInvitationCard({ sendEmail, onSetSendEmail, disabled = false, compact = false }: UserInvitationCardProps) {
  const id = useId();
  const Icon = sendEmail ? Send : Mail;

  return (
    <label
      htmlFor={id}
      data-recommended-tour="user-invitation"
      className={cn(
        "flex min-w-0 items-center gap-3 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary",
        compact ? "rounded py-1" : "card flex-row border p-3",
        !compact && (sendEmail ? "border-primary/50 bg-primary/10" : "border-base-300 bg-base-100/60"),
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
        !compact && !disabled && "hover:border-primary/50",
      )}
    >
      <span className={cn("flex shrink-0 self-start items-center justify-center rounded-full bg-primary/10 text-primary", compact ? "size-10" : "size-8")}>
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span id={`${id}-title`} className="block text-sm font-semibold">Inviter par email</span>
        <span className="mt-1 grid text-xs leading-relaxed text-base-content/70">
          <span
            id={sendEmail ? `${id}-description` : undefined}
            aria-hidden={!sendEmail}
            className={cn("col-start-1 row-start-1", !sendEmail && "invisible")}
          >
            Invitation prévue à la création : un email lui permettra de choisir son mot de passe.
          </span>
          <span
            id={!sendEmail ? `${id}-description` : undefined}
            aria-hidden={sendEmail}
            className={cn("col-start-1 row-start-1", sendEmail && "invisible")}
          >
            Invitation à envoyer plus tard, depuis la liste des utilisateurs.
          </span>
        </span>
      </span>
      <input
          id={id}
          type="checkbox"
          role="switch"
          name="invitationSent"
          className={cn("toggle toggle-primary shrink-0", !compact && "toggle-sm")}
          checked={sendEmail}
          onChange={(event) => onSetSendEmail(event.target.checked)}
          disabled={disabled}
          aria-describedby={`${id}-description`}
          aria-labelledby={`${id}-title`}
      />
    </label>
  );
}
