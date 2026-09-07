import AuthPageWrapper from "./AuthPageWrapper";

type Props = {
  onNext: () => void;
};

const Welcome = ({ onNext }: Props) => {
  return (
    <AuthPageWrapper title="Bienvenue sur la plateforme d'apprentissage ANDRIA">
      <div className="flex flex-col items-center gap-5 text-center">
        <p className="mt-5">
          Un premier utilisateur administrateur est requis avant d'accéder à la
          plateforme.
        </p>
        <p className="text-info/80 text-sm">
          L'étape suivante vous assistera à sa création.
        </p>
        <button className="btn" onClick={onNext}>
          Commencer
        </button>
      </div>
    </AuthPageWrapper>
  );
};

export default Welcome;
