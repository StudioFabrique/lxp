import Header from "../../../components/UI/header";
import ModuleImage from "../../../assets/images/module_arborescence.webp";
import ModuleForm from "./add-module-form";
import useModuleAdd from "./use-module-add";
import useForm from "../../../components/UI/forms/hooks/use-form";
import ModuleMetadatas from "./module-metadatas";
import Wrapper from "../../../components/UI/wrapper/wrapper.component";

function ModuleAdd() {
  const {
    formationsList,
    parcoursList,
    parcours,
    handleFormation,
    handleParcours,
  } = useModuleAdd();

  const { errors, values, onChangeValue } = useForm();

  const data = { values, errors, onChangeValue };

  return (
    <main className="w-full min-h-screen flex flex-col items-center px-4 py-8 gap-8">
      <section className="w-full">
        <Header
          title="Créer un nouveau module"
          description="Créer un nouveau module pour une formation ou un parcours"
        />
      </section>
      <section className="flex-1 grid grid-cols-2 gap-8 ">
        <article>
          <ModuleForm
            formationsList={formationsList}
            parcoursList={parcoursList}
            onSelectFormation={handleFormation}
            onSelectParcours={handleParcours}
          />
        </article>
        <article className="h-4/6 flex justify-center items-center">
          <img
            className="w-3/6 h-auto"
            src={ModuleImage}
            alt="Module Arborescence"
          />
        </article>
      </section>
      <section className="w-full grid grid-cols-2 gap-8">
        <form onSubmit={() => {}}>
          <ModuleMetadatas data={data} />
        </form>
        <Wrapper>
          {!parcours ? (
            <article className="w-full h-full flex flex-col justify-center items-center gap-y-4">
              <h2 className="w-4/6 text-lg font-bold">Nouveau module</h2>
              <p className="w-4/6 text-xs text-justify">
                Pour ajouter le module au parcours en cours d'édition, dupliquez
                le module et éditez le pour lui ajouter des formateurs et des
                compétences
              </p>
            </article>
          ) : (
            <p>PARCOURS CHOISI</p>
          )}
        </Wrapper>
      </section>
    </main>
  );
}

export default ModuleAdd;
