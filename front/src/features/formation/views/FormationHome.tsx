import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import Wrapper from "../../../../src/components/wrappers/BoxWrapper";
import Header from "../../../../src/components/headers/Header";
import { useFormationForm } from "../hooks/useFormationForm";
import FormationForm from "../components/FormationForm";
import FormationsList from "../components/FormationsList";
import Modal from "../../../components/UI/modal/modal";

const FormationHome = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [formationToDelete, setFormationToDelete] = useState<number | null>(
    null,
  );
  const formationId = searchParams.get("formationId");

  const {
    title, setTitle,
    description, setDescription,
    code, setCode,
    level, setLevel,
    currentTags,
    tagInput, setTagInput,
    formationsList,
    createdFormation,
    dismissCreatedFormation,
    isEditing, isPending,
    isDeleting,
    deleteFormation,
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

  const openParcoursCreation = (id: number) => {
    navigate(`/admin/parcours/new?formationId=${id}`);
  };

  const confirmDeleteFormation = () => {
    if (formationToDelete === null) return;
    deleteFormation(formationToDelete, {
      onSuccess: () => setFormationToDelete(null),
    });
  };

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
            onCreateParcours={openParcoursCreation}
            onDelete={setFormationToDelete}
          />
        </article>
      </section>

      {createdFormation && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="text-lg font-bold">Formation créée</h3>
            <p className="py-4">
              Voulez-vous maintenant créer un parcours associé à la formation
              « {createdFormation.title} » ?
            </p>
            <div className="modal-action">
              <button
                className="btn btn-outline"
                onClick={dismissCreatedFormation}
              >
                Plus tard
              </button>
              <button
                className="btn btn-primary"
                onClick={() => openParcoursCreation(createdFormation.id)}
              >
                Créer un parcours
              </button>
            </div>
          </div>
        </dialog>
      )}

      {formationToDelete !== null && (
        <Modal
          title="Supprimer la formation"
          leftLabel="Annuler"
          rightLabel="Supprimer"
          isSubmitting={isDeleting}
          onLeftClick={() => setFormationToDelete(null)}
          onRightClick={confirmDeleteFormation}
        >
          <p className="py-4">
            Cette suppression est définitive. Elle n'est possible que si aucun
            parcours n'est associé à la formation.
          </p>
        </Modal>
      )}
    </div>
  );
};

export default FormationHome;
