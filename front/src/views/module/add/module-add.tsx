import Header from "../../../components/UI/header";
import ModuleImage from "../../../assets/images/arbo_module.webp";
import useModuleAdd from "./use-module-add";
import ModuleMetadatas from "./module-metadatas";
import Wrapper from "../../../components/UI/wrapper/wrapper.component";
import ModuleSelectFormation from "./module-select-formation";
import ModuleToParcours from "./module-to-parcours";

function ModuleAdd() {
  const {
    data,
    setFile,
    formation,
    formationsList,
    parcoursList,
    parcours,
    handleFormation,
    handleParcours,
    contacts,
    isLoading,
    skills,
    currentContacts,
    currentSkills,
    setCurrentContacts,
    setCurrentSkills,
  } = useModuleAdd();

  return (
    <main className="w-full min-h-screen flex flex-col items-center px-4 py-8 gap-8">
      <section className="w-full">
        <Header
          title="Créer un nouveau module"
          description="Créer un nouveau module pour une formation ou un parcours"
        />
      </section>
      <Wrapper>
        <section className="grid grid-cols-2 gap-8 ">
          <article className="w-full flex flex-col gap-y-4">
            <p className="font-bold">
              Commment par choisir la formation et / ou le parcours auxquels
              vous souhaitez attacher ce module
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
          <article className="flex justify-center">
            <img
              className="w-3/6 h-fit rounded-xl shadow-lg"
              src={ModuleImage}
              alt="Module Arborescence"
            />
          </article>
        </section>
      </Wrapper>
      {formation ? (
        <section className="w-full grid grid-cols-2 gap-8">
          <Wrapper>
            <form onSubmit={() => {}}>
              <ModuleMetadatas data={data} onSetFile={setFile} />
              <div className="flex justify-end mt-4 items-center">
                <button className="btn btn-secondary mr-4">
                  Réinitialiser
                </button>
                <button className="btn btn-primary ml-4">Enregistrer</button>
              </div>
            </form>
          </Wrapper>
          <Wrapper>
            {!parcours ? (
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
