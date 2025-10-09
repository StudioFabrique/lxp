import { Link, useParams, useSearchParams } from "react-router-dom";
import ModuleForm from "../../../components/edit-parcours/modules-section/module-form.component";
import { useRef } from "react";
import Header from "../../../components/UI/header";
import Wrapper from "../../../components/UI/wrapper/wrapper.component";

export default function ModuleAdd() {
  const [searchParams] = useSearchParams();
  const step = searchParams.get("step");
  const { parcoursId } = useParams();
  const ref = useRef(null);

  return (
    <main className="w-full xl:w-9/12 min-h-screen flex flex-col items-center px-4 py-8 gap-8">
      {/* En-tête de la page */}
      <section className="w-full">
        <Header
          title="Créer un nouveau module"
          description="Créer un nouveau module pour une formation ou un parcours"
        />
      </section>
      <section>
        <Wrapper>
          <ModuleForm
            ref={ref}
            isLoading={false}
            onCancel={() => {}}
            onSubmitModule={() => {}}
          />
        </Wrapper>
      </section>
    </main>
  );
}
