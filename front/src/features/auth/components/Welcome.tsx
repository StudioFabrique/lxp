type Props = {
  onNext: () => void;
};

const Welcome = ({ onNext }: Props) => {
  return (
    <div className="flex flex-col items-center text-center my-20 gap-10">
      <h2 className="text-lg font-semibold">
        Bienvenue sur la plateforme d'apprentissage ANDRIA
      </h2>
      <p>
        Un premier utilisateur administrateur est requis avant d'accéder à la
        plateforme.
      </p>
      <p className="text-info">
        L'étape suivante vous assistera à sa création.
      </p>
      <button className="btn" onClick={onNext}>
        Commencer
      </button>
    </div>
  );
};

export default Welcome;
