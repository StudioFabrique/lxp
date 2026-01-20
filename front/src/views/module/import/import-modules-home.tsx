import RepertoryImport from "../../../components/import-courses/repertory-import";
import useImportModules from "../hooks/use-import-modules";

/**
 * Import de cours.
 * 1. Choisir le repertoire dans lequel un fichier json et des cours (type texte et document) sont présents.
 * 2. Après que la vérification du format est validée, choisir une formation puis un parcours. Ensuite clic sur le bouton "choisir le parcours".
 * 3. Montrer un récapitulatif des cours.
 * 4. Après la confirmation de l'utilisateur, créer les modules, cours et leçons puis envoyer de façon progressive les activités au backend (avec une barre de progression).
 */
const ImportModulesHome = () => {
  const { importStep } = useImportModules();

  return (
    <div>
      <RepertoryImport />
    </div>
  );
};

export default ImportModulesHome;
