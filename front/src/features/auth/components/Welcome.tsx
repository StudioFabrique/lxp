import AuthPageWrapper from "./AuthPageWrapper";
import { ArrowRight, KeyRound, UserRoundPlus } from "lucide-react";

type Props = {
  onNext: () => void;
};

const Welcome = ({ onNext }: Props) => {
  return (
    <AuthPageWrapper
      variant="setup"
      title="Bienvenue sur ANDRIA"
    >
      <div className="space-y-7">
        <ol className="divide-y divide-base-300" aria-label="Étapes de la configuration">
          <li className="flex items-center gap-4 py-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><KeyRound className="size-4" aria-hidden="true" /></span>
            <span><strong className="block text-sm text-base-content">Clé d’activation</strong><span className="text-xs text-base-content/60">Validez l’accès à la configuration.</span></span>
          </li>
          <li className="flex items-center gap-4 py-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><UserRoundPlus className="size-4" aria-hidden="true" /></span>
            <span><strong className="block text-sm text-base-content">Compte administrateur</strong><span className="text-xs text-base-content/60">Créez votre accès à la plateforme.</span></span>
          </li>
        </ol>
        <button className="btn btn-primary w-full gap-2 rounded-lg normal-case text-base-100" onClick={onNext}>
          Commencer <ArrowRight className="size-4" aria-hidden="true" />
        </button>
      </div>
    </AuthPageWrapper>
  );
};

export default Welcome;
