import Modal from "../../../../../components/UI/modal/modal";

type Props = {
  isSubmitting: boolean;
  /** Aucun cours publié et visible : les apprenants verront un parcours sans contenu. */
  hasNoVisibleCourse?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

const PublishParcoursModal = ({
  isSubmitting,
  hasNoVisibleCourse = false,
  onConfirm,
  onCancel,
}: Props) => (
  <Modal
    title="Publier le parcours"
    leftLabel="Annuler"
    onLeftClick={onCancel}
    rightLabel="Publier"
    rightClassName="btn-primary"
    onRightClick={onConfirm}
    isSubmitting={isSubmitting}
  >
    <p className="py-4">
      Souhaitez-vous publier ce parcours ? Une fois publié, il sera visible par
      les apprenants rattachés.
    </p>
    {hasNoVisibleCourse ? (
      <div role="alert" className="alert alert-warning">
        <span>
          Aucun cours n’est publié et visible : les apprenants verront « Pas
          encore de contenu ». Publiez au moins un cours depuis le contenu du
          module.
        </span>
      </div>
    ) : null}
  </Modal>
);

export default PublishParcoursModal;
