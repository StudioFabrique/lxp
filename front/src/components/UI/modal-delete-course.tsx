type Props = {
  courseId: number;
  courseTitle: string;
  message: string;
  rightLabel: string;
  onCloseModal: () => void;
  onConfirm: () => void;
};

export default function ModalDeleteCourse(props: Props) {
  return (
    <dialog id="my_modal_3" className="modal">
      <div className="modal-box">
        <form method="dialog" onSubmit={props.onCloseModal}>
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">
          Supprimer le cours : {props.courseTitle}
        </h3>
        <p className="py-4">{props.message}</p>
        <div className="w-full flex justify-end gap-x-2 mt-4">
          <form method="dialog" onSubmit={props.onCloseModal}>
            <button
              className="btn btn-sm btn-outline"
              type="submit"
              aria-label="supprime le cours"
            >
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
}
