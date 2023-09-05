import SubWrapper from "../../UI/sub-wrapper/sub-wrapper.component";
import Wrapper from "../../UI/wrapper/wrapper.component";
import ModuleForm from "./module-form.component";

const ModulesSection = () => {
  return (
    <div className="flex flex-col gap-y-8">
      <section>
        <h1 className="text-3xl font-extrabold">Modules</h1>
      </section>
      <Wrapper>
        <section className="grid lg:grid-cols-2 gap-8">
          <article>
            <ModuleForm />
          </article>
          <article className="min-h-full">
            <SubWrapper>
              <div className="min-h-full">Liste des modules</div>
            </SubWrapper>
          </article>
        </section>
      </Wrapper>
    </div>
  );
};

export default ModulesSection;
