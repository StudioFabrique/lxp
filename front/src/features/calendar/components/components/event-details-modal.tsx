import { PropsWithChildren, useRef } from "react";
import { normalizeImageSource } from "../../../../utils/images/image-source";

interface Props {
  modalId: string;
  item?: {
    id: number | string;
    title?: string;
    description?: string;
    img?: string;
  };
  isOpen: boolean;
  onClose?: () => void;
}

const EventDetailsModal = ({
  modalId,
  isOpen,
  item,
  onClose,
  children,
}: PropsWithChildren<Props>) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  return (
    <dialog
      id={modalId}
      className="modal"
      ref={modalRef}
      onClose={onClose}
      open={isOpen}
    >
      <div className="modal-box p-0 bg-transparent shadow-none w-full max-w-md overflow-visible">
        <div className="card bg-base-100 shadow-xl w-full">
          {/* --- CARD IMAGE --- */}
          {item?.img && (
            <figure className="h-48 w-full relative overflow-hidden bg-gray-100">
              <img
                src={normalizeImageSource(item.img)}
                alt={item.title}
                className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <h2 className="absolute bottom-4 left-4 text-white text-2xl font-bold drop-shadow-md">
                {item.title}
              </h2>
            </figure>
          )}

          {/* --- CARD BODY (FORM) --- */}
          <div className="card-body gap-4">
            {!item?.img && (
              <h2 className="card-title text-2xl">{item?.title}</h2>
            )}

            <p className="text-sm text-gray-500">{item?.description}</p>

            {/* --- CARD ACTIONS --- */}
            <div className="card-actions justify-end mt-4">
              <form method="dialog">
                <button className="btn btn-ghost hover:bg-base-200">
                  Annuler
                </button>
              </form>
              {children}
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop to close */}
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default EventDetailsModal;
