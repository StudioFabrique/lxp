interface ModalSuppressionProps {
  message: string;
  rightLabel: string;
  moduleTitle: string;
  onCloseModal: () => void;
  onConfirm: () => void;
}

const ModalSuppression = (props: ModalSuppressionProps) => {
  return (
    <dialog id="my_modal_3" className="modal">
      <div className="modal-box">
        <form method="dialog" onSubmit={props.onCloseModal}>
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg text-warning">
          Supprimer le module {props.moduleTitle}
        </h3>
        <p className="py-4">{props.message}</p>
        <div className="w-full flex justify-end gap-x-2 mt-4">
          <form method="dialog" onSubmit={props.onCloseModal}>
            <button className="btn btn-sm btn-outline" type="submit">
              Annuler
            </button>
          </form>
          <button className="btn btn-sm btn-error" onClick={props.onConfirm}>
            {props.rightLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default ModalSuppression;
