import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import { normalizeImageSource } from "../../../../../../src/utils/images/image-source";
import { formatDateToYYYYMMDD } from "../../../../../../src/utils/helpers/convert-date";
import DatePicker from "./date-picker";
import { parcoursApi } from "../../../api/parcours.api";
import type Module from "../../../../../utils/interfaces/module";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router";
import { parcoursKeys } from "../../../api/parcours.keys";

interface Props {
  datesParcours: { startDate: Date; endDate: Date };
  modalId: string;
  isOpen: boolean;
  onClose: () => void;
  currentModule: Module | null;
}

const ModuleTimelineDateModal = ({
  datesParcours,
  modalId,
  isOpen,
  onClose,
  currentModule,
}: Props) => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const modalRef = useRef<HTMLDialogElement>(null);

  const [datesModule, setDatesModule] = useState({
    minDate: "",
    maxDate: "",
  });

  // Sync state with currentModule
  const setInitDates = useCallback(() => {
    if (currentModule) {
      setDatesModule({
        minDate: formatDateToYYYYMMDD(
          new Date(currentModule.minDate || datesParcours.startDate),
        ),
        maxDate: formatDateToYYYYMMDD(
          new Date(
            currentModule.maxDate ||
              datesParcours.startDate.setDate(
                datesParcours.startDate.getDate() + 1,
              ),
          ),
        ),
      });
    }
  }, [currentModule, datesParcours.startDate]);

  const handleSetDates = (id: string, date: string) => {
    const newMinDate = id === "minDate" ? date : datesModule.minDate;
    const newMaxDate = id === "maxDate" ? date : datesModule.maxDate;

    setDatesModule({
      minDate: newMinDate,
      maxDate: newMaxDate,
    });

    // Validation Logic
    const dMin = newMinDate ? new Date(newMinDate) : null;
    const dMax = newMaxDate ? new Date(newMaxDate) : null;

    if (dMin && dMin < datesParcours.startDate) {
      return setError(
        `La date de début du module doit être supérieur à la date de début du parcours.`,
      );
    }
    if (dMax && dMax > datesParcours.endDate) {
      return setError(
        `La date de fin du module doit être inférieur à la date de fin du parcours`,
      );
    }
    if (dMin && dMax && dMin > dMax) {
      return setError(
        "Le date de début du module ne peut pas débuter après la date de fin du module.",
      );
    }
    setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (error || !currentModule?.id) return;

    try {
      await parcoursApi.mutations.updateModuleCalendarDates({
        moduleId: currentModule.id,
        minDate: datesModule.minDate,
        maxDate: datesModule.maxDate,
      });
      await queryClient.invalidateQueries({
        queryKey: parcoursKeys.detail(Number(id)),
      });
      toast.success("Dates mises à jour");
      modalRef.current?.close();
    } catch {
      toast.error("Erreur lors de la mise à jour des dates");
    }
  };

  useEffect(() => {
    if (currentModule && isOpen && modalRef.current) {
      modalRef.current.showModal();
    }
  }, [currentModule, isOpen]);

  useEffect(() => {
    setInitDates();
  }, [setInitDates]);

  if (!currentModule) return null;

  return (
    <dialog id={modalId} className="modal" ref={modalRef} onClose={onClose}>
      <div className="modal-box p-0 bg-transparent shadow-none w-full max-w-md overflow-visible">
        <div className="card bg-base-100 shadow-xl w-full">
          {/* --- CARD IMAGE --- */}
          {currentModule.thumb && (
            <figure className="h-48 w-full relative overflow-hidden bg-gray-100">
              <img
                src={normalizeImageSource(currentModule.thumb)}
                alt={currentModule.title}
                className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <h2 className="absolute bottom-4 left-4 text-white text-2xl font-bold drop-shadow-md">
                {currentModule.title}
              </h2>
            </figure>
          )}

          {/* --- CARD BODY (FORM) --- */}
          <div className="card-body gap-4">
            {!currentModule.thumb && (
              <h2 className="card-title text-2xl">{currentModule.title}</h2>
            )}

            <p className="text-sm text-gray-500">
              Modifiez les dates de disponibilité pour ce module.
            </p>

            <div className="flex flex-col">
              <DatePicker
                id="minDate"
                label="Date de début"
                date={datesModule.minDate}
                onSubmitDate={handleSetDates}
              />
              <DatePicker
                id="maxDate"
                label="Date de fin"
                date={datesModule.maxDate}
                onSubmitDate={handleSetDates}
              />
            </div>

            {/* Error Message */}
            <div className="h-6 text-xs text-error font-semibold">{error}</div>

            {/* --- CARD ACTIONS --- */}
            <div className="card-actions justify-end mt-4">
              <form method="dialog">
                <button className="btn btn-ghost hover:bg-base-200">
                  Annuler
                </button>
              </form>
              <button
                onClick={handleSubmit}
                className="btn btn-primary text-white"
                disabled={!!error}
              >
                Sauvegarder
              </button>
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

export default ModuleTimelineDateModal;
