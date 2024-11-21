import { FC, useEffect, useState } from "react";
import Portal from "../../UI/portal/portal";

const TableActionsModal: FC<{
  title: string;
  desc?: string;
  descList?: string[];
  error?: string;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
}> = ({ title, desc, descList, error, onCancel, onConfirm }) => {
  const [isLoading, setIsloading] = useState<boolean>(false);

  const handleConfirmAction = async () => {
    setIsloading(true);
    await onConfirm();
    setIsloading(false);
    // after completed request, close the modal with onCancel
    onCancel();
  };

  useEffect(() => {
    document.body.addEventListener(
      "keydown",
      (e) => e.key === "Escape" && onCancel(),
    );
  });

  return (
    <Portal>
      <div className="relative left-0 top-0 w-screen h-screen bg-black/20 z-20">
        <div className="absolute modal-open z-50 top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] min-w-[30rem]">
          <div className="modal-box px-8 w-full">
            <div className="flex gap-x-2">
              <h3 className="font-bold pb-4 text-primary">{title}</h3>
            </div>
            <p className="text-secondary">{desc}</p>
            {descList ? (
              <ul className="py-2 flex flex-col gap-1">
                {descList.map((item) => (
                  <li>{item}</li>
                ))}
              </ul>
            ) : null}
            <p className="text-error text-sm pb-2">
              Attention: Cette opération ne peut pas être annulée
            </p>
            <div className="modal-action flex justify-between overflow-x-hidden">
              <button
                className="btn btn-outline btn-primary btn-md"
                onClick={onCancel}
              >
                Annuler
              </button>
              <button
                className={`btn btn-primary btn-md ${isLoading && "loading"}`}
                onClick={handleConfirmAction}
              >
                Supprimer
              </button>
            </div>
            {error && <p>{error}</p>}
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default TableActionsModal;
