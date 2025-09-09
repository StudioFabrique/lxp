import z from "zod";
import ResourcesAddHeader from "../../components/resources-add/ResourcesAddHeader";
import useForm from "../../components/UI/forms/hooks/use-form";
import ListHeader from "../../components/UI/list-header";
import Wrapper from "../../components/UI/wrapper/wrapper.component";
import Field from "../../components/UI/forms/field";
import FieldArea from "../../components/UI/forms/field-area";
import { ChangeEvent, useEffect, useState } from "react";
import { getNewTags } from "../../utils/tags";
import Tag from "../../utils/interfaces/tag";
import TagsList from "../../components/formation-home/tags-list";
import QuestionMarkTooltip from "../../components/UI/question-mark-tooltip/question-mark-tooltip";
import { HelpCircle } from "lucide-react";
import useHttp from "../../hooks/use-http";

const schema = z.object({
  title: z
    .string()
    .min(2, { message: "Le titre doit contenir au moins 2 caractères." }),
  description: z.string().min(10, {
    message: "La description doit contenir au moins 10 caractères.",
  }),
});

let i = 0;

export default function ResourceAdd() {
  const {
    errors,
    values,
    onChangeValue,
    onValidationErrors,
    onResetForm,
    onValidateForm,
  } = useForm({}, schema);

  const data = { values, errors, onChangeValue };
  const { sendRequest, isLoading, error } = useHttp();

  const [inputTag, setInputTag] = useState<string>("");
  const [tags, setTags] = useState<Tag[]>([]);

  const handleSubmit = () => {
    // Génère une couleur RGB aléatoire
    const color =
      "rgb(" +
      Math.floor(Math.random() * 256) +
      "," +
      Math.floor(Math.random() * 256) +
      "," +
      Math.floor(Math.random() * 256) +
      ")";

    const result = {
      name: inputTag,
      color,
      id: i++,
    };

    setTags((prev) => [...prev, result]);
  };

  const handleUpdateTag = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setInputTag(value);
  };

  // Detecte qd la touche enter est pressée
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSubmit();
      setInputTag("");
    }
  };

  const removeTag = (id: number) => {
    setTags((prev) => prev.filter((tag) => tag.id !== id));
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    onValidateForm();
    if (errors.length === 0) {
      console.log("Envoi du formulaire", values, tags);
      const applyData = (data: any) => {
        console.log(data);
      };
      sendRequest(
        { path: "/resource", method: "post", body: { ...values, tags } },
        applyData
      );
      onResetForm();
      setTags([]);
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center">
      <ListHeader>
        <ResourcesAddHeader />
        <div className="w-full flex-1 flex pb-24">
          <section className="w-2/6 h-full flex flex-col gap-4">
            <article className="flex-1">
              <Wrapper>
                <h2 className="text-lg font-bold">Ressource</h2>
                <form
                  className="flex flex-col gap-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                  }}
                >
                  <Field
                    placeholder="Titre de la ressource"
                    label="Titre"
                    name="title"
                    type="text"
                    data={data}
                  />

                  <label>Tags</label>
                  <span className="flex items-center gap-x-2 w-full">
                    <input
                      className="input input-sm focus:outline-none w-full"
                      type="text"
                      name="tag"
                      placeholder="Ajouter un tag"
                      value={inputTag}
                      onChange={handleUpdateTag}
                      onKeyDown={handleKeyDown} // Ajouté ici
                    />
                    <QuestionMarkTooltip
                      tooltipValue="Les tags aident à trouver du contenu par mots clés."
                      tooltipPosition="left"
                    >
                      <HelpCircle className="w-6 h-6 text-primary" />
                    </QuestionMarkTooltip>
                  </span>
                  <p className="text-xs text-secondary pl-1">
                    Appuyer sur la touche "Entrée" après avoir saisi un nom de
                    tag pour l'ajouter à la liste.
                  </p>

                  <TagsList tagsList={tags} onRemove={removeTag} />

                  <FieldArea
                    placeholder="Description de la ressource"
                    label="Description"
                    name="description"
                    data={data}
                  />

                  <div className="w-full flex justify-end">
                    <button className="btn btn-primary">Ajouter</button>
                  </div>
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
