type Props = {
  textActivityTitle?: string;
  onCloseDeleteModal: () => void;
  onConfirmDelete: () => void;
};

const ActivityDeleteModal = ({
  textActivityTitle,
  onCloseDeleteModal,
  onConfirmDelete,
}: Props) => (
  <div className="flex flex-col gap-4 items-center pt-10 px-5">
    <p className="text-center">
      Êtes-vous sûr de vouloir supprimer l'activité "{textActivityTitle}" ?
      Cette action est irréversible.
    </p>
    <div className="flex gap-4">
      <button
        className="btn btn-ghost"
        onClick={() => {
          onCloseDeleteModal();
        }}
      >
        Annuler
      </button>
      <button className="btn btn-error text-base-100" onClick={onConfirmDelete}>
        Supprimer
      </button>
    </div>
  </div>
);

export default ActivityDeleteModal;
