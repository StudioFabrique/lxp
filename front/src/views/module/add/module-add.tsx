//import { useRef } from "react";
import Header from "../../../components/UI/header";
import Wrapper from "../../../components/UI/wrapper/wrapper.component";
import ModuleMetadatas from "./module-metadatas";
import useForm from "../../../components/UI/forms/hooks/use-form";

export default function ModuleAdd() {
  //const ref = useRef(null);
  const { errors, onChangeValue, values } = useForm();

  const data = { values, onChangeValue, errors };

  return (
    <main className="p-2 flex flex-col items-center gap-y-8">
      {/* En-tête de la page */}
      <section className="flex justify-center w-full">
        <Header
          title="Créer un nouveau module"
          description="Créer un nouveau module pour une formation ou un parcours"
        />
      </section>
      <section className="flex justify-start w-full">
        <Wrapper>
          <form
            onSubmit={(e: React.FormEvent) => e.preventDefault()}
            ref={null}
          >
            <div className="grid grid-cols-1 lg:grid-cols-11 gap-2">
              <span className="col-span-5">
                <ModuleMetadatas
                  data={data}
                  thumb={null}
                  onSetFile={() => {}}
                  mode="create"
                />
              </span>
            </div>
          </form>
        </Wrapper>
      </section>
    </main>
  );
}
