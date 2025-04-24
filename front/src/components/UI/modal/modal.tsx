import type { PropsWithChildren } from "react";
import { Loader2, Minimize2 } from "lucide-react";

/**
 * Composant Modal réutilisable
 * @param onLeftClick - Fonction appelée lors du clic sur le bouton gauche
 * @param onRightClick - Fonction appelée lors du clic sur le bouton droit
 * @param title - Titre de la modal
 * @param children - Contenu de la modal
 * @param leftLabel - Texte du bouton gauche (optionnel)
 * @param rightLabel - Texte du bouton droit
 * @param isSubmitting - État de chargement des boutons
 * @param buttonsBothTopBottom - Affiche les boutons en haut et en bas de la modal
 * @param modalBoxStyle - Style CSS personnalisé pour la boîte modale
 * @param sendModalBottom - Place la modal en arrière-plan (z-index 0)
 */

type ModalProps = {
  onLeftClick?: () => void;
  onRightClick?: () => void;
  onMinimizeClick?: () => void;
  title: string;
  leftLabel?: string;
  rightLabel?: string;
  isSubmitting?: boolean;
  buttonsBothTopBottom?: boolean;
  modalBoxStyle?: string;
  sendModalBottom?: boolean;
};

const Modal = (props: PropsWithChildren<ModalProps>) => {
  // Définit la valeur par défaut de isSubmitting
  const isSubmitting =
    props.isSubmitting !== undefined ? props.isSubmitting : false;

  return (
    <dialog
      id="my_modal_4"
      className={`modal modal-open ${props.sendModalBottom && "z-0"}`}
    >
      <div className={`modal-box ${props.modalBoxStyle}`}>
        {/* Affiche les boutons en haut si buttonsBothTopBottom est true */}
        {props.buttonsBothTopBottom && (
          <div className="modal-action mb-4">
            {/* Bouton gauche (optionnel) */}
            {props.leftLabel && (
              <button
                className="btn btn-outline btn-primary"
                onClick={props.onLeftClick}
              >
                {props.leftLabel}
              </button>
            )}
            {/* Bouton droit avec indicateur de chargement */}
            {props.onRightClick && (
              <button
                className="btn btn-warning flex items-center gap-x-2"
                disabled={isSubmitting}
                onClick={props.onRightClick}
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : null}
                <span>{props.rightLabel}</span>
              </button>
            )}
          </div>
        )}
        <div className="flex justify-between">
          {/* Titre de la modal */}
          <h3 className="font-bold text-lg">{props.title}</h3>
          {props.onMinimizeClick && (
            <button
              className="btn btn-sm btn-ghost"
              onClick={props.onMinimizeClick}
            >
              <Minimize2 />
            </button>
          )}
        </div>
        {/* Contenu de la modal */}
        {props.children}
        {/* Boutons en bas de la modal */}
        <div className="modal-action">
          {/* Bouton gauche (optionnel) */}
          {props.onLeftClick && (
            <button
              className="btn btn-outline btn-primary"
              onClick={props.onLeftClick}
            >
              {props.leftLabel}
            </button>
          )}
          {/* Bouton droit avec indicateur de chargement */}
          {props.onRightClick && (
            <button
              className="btn btn-warning flex items-center gap-x-2"
              disabled={isSubmitting}
              onClick={props.onRightClick}
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : null}
              <span>{props.rightLabel}</span>
            </button>
          )}
        </div>
      </div>
    </dialog>
  );
};

export default Modal;
