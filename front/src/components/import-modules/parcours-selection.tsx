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
      />
    </div>
  );
};

export default ParcoursSelection;
