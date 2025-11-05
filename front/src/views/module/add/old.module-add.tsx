// Importation des composants et hooks nécessaires
import Header from "../../../components/UI/header";
import ModuleImage from "../../../assets/images/arbo_module.webp";
import useModuleAdd from "./use-module-add";
import ModuleMetadatas from "./module-metadatas";
import Wrapper from "../../../components/UI/wrapper/wrapper.component";
import ModuleSelectFormation from "./module-select-formation";
import ModuleToParcours from "./module-to-parcours";

/**
 * Page de création d'un nouveau module
 *
 * Cette page permet de créer un nouveau module pour une formation ou un parcours.
 * Elle gère la sélection de la formation/parcours, les métadonnées du module,
 * et les associations avec les contacts et compétences si un parcours est sélectionné.
 */
function ModuleAdd() {
  // Récupération des données et fonctions du hook personnalisé
  const {
    data, // Données du module
    setFile, // Fonction pour définir le fichier
    formation, // Formation sélectionnée
    formationsList, // Liste des formations disponibles
    parcoursList, // Liste des parcours disponibles
    parcours, // Parcours sélectionné
    handleFormation, // Gestionnaire de sélection de formation
    handleParcours, // Gestionnaire de sélection de parcours
    handleSubmit, // Gestionnaire de soumission
    contacts, // Liste des contacts disponibles
    isLoading, // État de chargement
    skills, // Liste des compétences disponibles
    currentContacts, // Contacts actuellement sélectionnés
    currentSkills, // Compétences actuellement sélectionnées
    setCurrentContacts, // Fonction pour mettre à jour les contacts sélectionnés
    setCurrentSkills, // Fonction pour mettre à jour les compétences sélectionnées
  } = useModuleAdd();

  /**
   * Fonction pour gérer la soumission du formulaire
   * Empêche le comportement par défaut du formulaire et déclenche la soumission personnalisée
   *
   * @param {React.FormEvent} event - L'évènement de soumission du formulaire
   */
  const handleForm = (event: React.FormEvent) => {
    event.preventDefault();
    handleSubmit();
  };

  return (
    <main className="w-full min-h-screen flex flex-col items-center px-4 py-8 gap-8">
      {/* En-tête de la page */}
      <section className="w-full">
        <Header
          title="Créer un nouveau module"
          description="Créer un nouveau module pour une formation ou un parcours"
        />
      </section>
      <Wrapper>
        {/* Section de sélection de la formation/parcours */}
        <section className="grid grid-cols-2 gap-8 ">
          <article className="w-full flex flex-col gap-y-4">
            <p className="font-bold">
              Commencez par choisir la formation et/ou le parcours auxquels vous
              souhaitez attacher ce module
            </p>
            <span className="h-4/6 flex items-center">
              <ModuleSelectFormation
                formationsList={formationsList}
                parcoursList={parcoursList}
                onSelectFormation={handleFormation}
                onSelectParcours={handleParcours}
              />
            </span>
          </article>
          {/* Image illustrative */}
          <article className="w-full flex justify-center items-center">
            <img
              className="w-3/6 h-fit rounded-xl shadow-lg"
              src={ModuleImage}
              alt="Module Arborescence"
            />
          </article>
        </section>
      </Wrapper>
      {/* Affichage conditionnel du formulaire une fois la formation sélectionnée */}
      {formation ? (
        <section className="w-full grid grid-cols-2 gap-8">
          {/* Formulaire des métadonnées du module */}
          <Wrapper>
            <form onSubmit={handleForm}>
              <ModuleMetadatas data={data} onSetFile={setFile} />
              <div className="flex justify-end mt-4 items-center">
                <button className="btn btn-secondary mr-4">
                  Réinitialiser
                </button>
                <button className="btn btn-primary ml-4">Enregistrer</button>
              </div>
            </form>
          </Wrapper>
          {/* Section conditionnelle pour le parcours */}
          <Wrapper>
            {!parcours ? (
              // Message informatif si aucun parcours n'est sélectionné
              <article className="w-full h-full flex flex-col justify-center items-center gap-y-4">
                <h2 className="w-4/6 text-lg font-bold">
                  Nouveau module de formation
                </h2>
                <p className="w-4/6 text-xs text-justify">
                  Si vous souhaitez attacher ce module à un parcours, veuillez
                  sélectionner un parcours ci-dessus. Sinon, il vous sera
                  toujours possible de rattacher ce module à un parcours plus
                  tard.
                </p>
              </article>
            ) : (
              // Composant de gestion des associations si un parcours est sélectionné
              <ModuleToParcours
                currentContacts={currentContacts}
                currentSkills={currentSkills}
                setCurrentContacts={setCurrentContacts}
                setCurrentSkills={setCurrentSkills}
                contacts={contacts}
                isLoading={isLoading}
                skills={skills}
              />
            )}
          </Wrapper>
        </section>
      ) : null}
    </main>
  );
}

export default ModuleAdd;
