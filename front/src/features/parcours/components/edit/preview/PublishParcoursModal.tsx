import Modal from "../../../../../components/UI/modal/modal";

type Props = {
  isSubmitting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

const PublishParcoursModal = ({ isSubmitting, onConfirm, onCancel }: Props) => (
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
      les étudiants rattachés.
    </p>
  </Modal>
);

export default PublishParcoursModal;
