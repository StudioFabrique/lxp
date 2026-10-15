import Modal from "../../../../components/UI/modal/modal";

type Props = {
  isEditing: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  /** Enregistrement du groupe en cours : loader sur la confirmation, boutons désactivés. */
  isSubmitting?: boolean;
};

const GroupEmptyWarningModal = ({ isEditing, onConfirm, onCancel, isSubmitting = false }: Props) => (
  <Modal
    title="Aucun étudiant ajouté"
    leftLabel="Retour au formulaire"
    onLeftClick={onCancel}
    rightLabel={isEditing ? "Poursuivre la modification" : "Poursuivre la création"}
    onRightClick={onConfirm}
    isSubmitting={isSubmitting}
  >
    <p className="py-4">
      Aucun étudiant n'a été ajouté au groupe. Souhaitez-vous poursuivre la{" "}
      {isEditing ? "modification" : "création"} ?
    </p>
  </Modal>
);

export default GroupEmptyWarningModal;
