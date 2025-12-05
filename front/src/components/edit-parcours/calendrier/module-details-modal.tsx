/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { formatDate } from "../../UI/calendar/calendar-utils";

interface Props {
  modalId: string;
  isOpen: boolean;
  onClose: () => void;
}

const ModuleDetailsModal = ({ modalId, isOpen, onClose }: Props) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const currentModule = useSelector(
    (state: any) => state.parcoursModules.currentModule
  );

  useEffect(() => {
    if (currentModule && isOpen && modalRef.current) {
      modalRef.current.showModal();
    }
  }, [currentModule, isOpen]);

  if (!currentModule) return null;

  console.log({ currentModule });

  return (
    <dialog id={modalId} className="modal" ref={modalRef} onClose={onClose}>
      <div className="modal-box p-0 bg-transparent shadow-none w-full max-w-lg overflow-visible">
        <div className="card bg-base-100 shadow-xl w-full overflow-hidden">
          {/* --- BANNER IMAGE --- */}
          {currentModule.thumb && (
            <figure className="h-40 w-full relative bg-gray-100">
              <img
                src={`data:image/jpeg;base64,${currentModule.thumb}`}
                alt={currentModule.title}
                className="w-full h-full object-cover"
              />
              {/* Gradient Overlay for Title */}
              <div className="absolute inset-0 bg-gradient-to-t from-base-100 via-transparent to-transparent"></div>
            </figure>
          )}

          {/* --- CONTENT --- */}
          <div className="card-body pt-5">
            <h2 className="card-title text-2xl mb-2">{currentModule.title}</h2>

            {/* Badges / Stats */}
            <div className="flex flex-wrap gap-2">
              <div className="badge badge-primary badge-outline gap-1">
                Module
              </div>
            </div>

            <span className="p-4">{currentModule.module.description}</span>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4 bg-base-200/50 p-4 rounded-xl border border-base-200">
              <div>
                <span className="text-xs uppercase font-bold text-gray-500 block mb-1">
                  Début
                </span>
                <span className="font-medium flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 opacity-70"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {formatDate(currentModule.minDate)}
                </span>
              </div>
              <div>
                <span className="text-xs uppercase font-bold text-gray-500 block mb-1">
                  Fin
                </span>
                <span className="font-medium flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 opacity-70"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {formatDate(currentModule.maxDate)}
                </span>
              </div>
            </div>

            {/* Description (if exists in module interface) */}
            {currentModule.description && (
              <div className="mt-4">
                <h3 className="text-sm font-bold opacity-70 mb-1">
                  Description
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {currentModule.description}
                </p>
              </div>
            )}

            <div className="card-actions justify-end mt-6">
              <form method="dialog">
                <button className="btn" onClick={onClose}>
                  Fermer
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

export default ModuleDetailsModal;
