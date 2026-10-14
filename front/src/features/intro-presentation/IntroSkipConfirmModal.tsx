import Modal from "../../components/UI/modal/modal";

type Props = {
  isSaving: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

/** Avertissement avant de passer la présentation : elle ne sera plus proposée, mais reste accessible depuis le menu. */
const IntroSkipConfirmModal = ({ isSaving, onCancel, onConfirm }: Props) => (
  <Modal
    title="Passer la présentation ?"
    leftLabel="Continuer la présentation"
    rightLabel="Passer"
    isSubmitting={isSaving}
    onLeftClick={onCancel}
    onRightClick={onConfirm}
  >
    <p className="py-4">
      Cette présentation explique comment ANDRIA organise vos contenus, de l'organisme jusqu'aux activités.
      Si vous la passez, elle ne sera plus proposée automatiquement. Vous pourrez la revoir à tout moment
      depuis le menu, avec le bouton « Revoir la présentation ».
    </p>
  </Modal>
);

export default IntroSkipConfirmModal;
