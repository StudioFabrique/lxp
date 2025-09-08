import z from "zod";
import ResourcesAddHeader from "../../components/resources-add/ResourcesAddHeader";
import useForm from "../../components/UI/forms/hooks/use-form";
import ListHeader from "../../components/UI/list-header";
import Wrapper from "../../components/UI/wrapper/wrapper.component";
import Field from "../../components/UI/forms/field";
import FieldArea from "../../components/UI/forms/field-area";
import AddTag from "../../components/UI/add-tag";

const schema = z.object({
  title: z
    .string()
    .min(2, { message: "Le titre doit contenir au moins 2 caractères." }),
  description: z.string().min(10, {
    message: "La description doit contenir au moins 10 caractères.",
  }),
});

export default function ResourceAdd() {
  const { errors, values, onChangeValue, onValidationErrors, onResetForm } =
    useForm({}, schema);

  const data = { values, errors, onChangeValue };

  return (
    <main className="min-h-screen w-full flex flex-col items-center">
      <ListHeader>
        <ResourcesAddHeader />
        <div className="w-full flex-1 flex pb-24">
          <section className="w-2/6 h-full flex flex-col gap-4">
            <article className="flex-1">
              <Wrapper>
                <h2 className="text-lg font-bold">Ressource</h2>
                <form className="flex flex-col gap-y-4">
                  <Field
                    placeholder="Titre de la ressource"
                    label="Titre"
                    name="title"
                    type="text"
                    data={data}
                  />

                  <AddTag
                    error={false}
                    tag={tag}
                    placeholder="Exemple : artisanal, technologie, industriel"
                    onChangeValue={handleOnChange}
                    onSubmit={resetStyle}
                  />

                  <FieldArea
                    placeholder="Description de la ressource"
                    label="Description"
                    name="description"
                    data={data}
                  />
                </form>
              </Wrapper>
            </article>
            <article>
              <Wrapper>articles</Wrapper>
            </article>
          </section>
          <section>Preview</section>
        </div>
      </ListHeader>
    </main>
  );
}
