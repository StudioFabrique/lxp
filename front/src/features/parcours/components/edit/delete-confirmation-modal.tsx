import Modal from "../../../../components/UI/modal/modal";

type Props = {
  title: string;
  /** Texte de l'élément supprimé, rappelé pour éviter de confirmer le mauvais. */
  itemLabel: string;
  /** Promesse qui rejette en cas d'échec : la modale reste alors ouverte. */
  onConfirm: () => Promise<unknown>;
  onCancel: () => void;
};

const DeleteConfirmationModal = ({
  title,
  itemLabel,
  onConfirm,
  onCancel,
}: Props) => (
  <Modal
    title={title}
    leftLabel="Annuler"
    rightLabel="Supprimer"
    rightClassName="btn-error"
    onLeftClick={onCancel}
    onRightClick={onConfirm}
  >
    <div className="flex flex-col gap-y-3 py-4">
      <p className="wrap-break-word rounded-lg bg-base-200 px-3 py-2">
        {itemLabel}
      </p>
      <p>Cette action est irréversible.</p>
    </div>
  </Modal>
);

export default DeleteConfirmationModal;
