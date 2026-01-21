import Header from "../UI/header";

type Props = { onGoBack: () => void };

const ParcoursSelection = ({ onGoBack }: Props) => {
  return (
    <div className="flex flex-col gap-6 ml-5">
      <Header
        title="Première étape"
        description="Téléverser un dossier compressé de format .zip"
        successBgColor
        disabled
        onClick={onGoBack}
      />
      <Header
        title="Seconde étape"
        description="Selectionner le parcours auquels les modules seront rattachés"
        alternateBgColor
      >
        <button className="btn btn-success" disabled>
          Lancer le processus d'importation
        </button>
      </Header>
      <div className="flex flex-col gap-5 items-center">
        <div className="flex gap-5 items-center">
          <span>Parcours</span>
          <button className="btn btn-outline w-fit">Choisir le parcours</button>
        </div>
        <button className="btn btn-sm w-fit">
          Continuer sans rattacher les modules à un parcours
        </button>
      </div>
    </div>
  );
};

export default ParcoursSelection;
