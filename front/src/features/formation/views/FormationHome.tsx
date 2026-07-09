import { useEffect } from "react";
import { useSearchParams } from "react-router";
import Wrapper from "../../../../src/components/wrappers/BoxWrapper";
import Header from "../../../../src/components/headers/Header";
import { useFormationForm } from "../hooks/useFormationForm";
import FormationForm from "../components/FormationForm";
import FormationsList from "../components/FormationsList";

const FormationHome = () => {
  const [searchParams] = useSearchParams();
  const formationId = searchParams.get("formationId");

  const {
    title, setTitle,
    description, setDescription,
    code, setCode,
    level, setLevel,
    currentTags,
    tagInput, setTagInput,
    formationsList,
    isEditing, isPending,
    selectFormation,
    cancelEdit,
    handleTagSubmit,
    handleRemoveTag,
    handleSubmit,
  } = useFormationForm();

  useEffect(() => {
    if (formationId && !isNaN(+formationId)) {
      selectFormation(+formationId);
    }
  }, [formationId, selectFormation]);

  return (
    <div className="w-full flex flex-col gap-4">
      <Header
        title={
          isEditing ? "Mise à jour de la formation" : "Gestion de formations"
        }
        description="Création et mise à jour des formations"
      />

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-2">
        <article className="h-fit">
          <Wrapper>
            <FormationForm
              title={title}
              onTitle={setTitle}
              description={description}
              onDescription={setDescription}
              code={code}
              onCode={setCode}
              level={level}
              onLevel={setLevel}
              tagInput={tagInput}
              onTagInput={setTagInput}
              currentTags={currentTags}
              onTagSubmit={handleTagSubmit}
              onRemoveTag={handleRemoveTag}
              isEditing={isEditing}
              isPending={isPending}
              onSubmit={handleSubmit}
              onCancel={cancelEdit}
            />
          </Wrapper>
        </article>
        <article>
          <FormationsList
            formationsList={formationsList}
            onSelect={selectFormation}
          />
        </article>
      </section>
    </div>
  );
};

export default FormationHome;
