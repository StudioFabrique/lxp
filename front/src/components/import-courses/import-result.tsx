import { CourseImport } from "../../views/course/hooks/use-import-courses";
import Header from "../UI/header";
import Loader from "../UI/loader";

type Props = {
  importedCourses: CourseImport[];
};

const ImportResult = ({ importedCourses }: Props) => {
  const parcoursTitle = importedCourses[0]?.parcours?.title;

  return (
    <div className="flex flex-col gap-6 ml-5 animate-in fade-in duration-500">
      <Header
        title="Première étape"
        description="Téléverser un dossier compressé de format .zip"
        successBgColor
        isSubHeader
        disabled
      />
      <Header
        title="Seconde étape"
        description="Selectionner le parcours auquels les cours seront rattachés"
        successBgColor
        isSubHeader
        disabled
      />
      <Header
        title="Traitement de l'importation..."
        description={`Les cours selectionnés sont en cours d'importation${parcoursTitle ? " dans le parcours " + parcoursTitle : ""}. Merci de ne pas quitter ou recharger la page.`}
        alternateBgColor
        isSubHeader
      >
        <Loader />
      </Header>
    </div>
  );
};

export default ImportResult;
