import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import Modal from "../../../components/UI/modal/modal";
import { HierarchicalListRow } from "../../../components/UI/hierarchical-list-card/HierarchicalListRow";
import type { CalendarEvent } from "./calendar-configuration";

export default function CalendarOverflowModal({ events, onClose, onClickDetails }: {
  events: CalendarEvent[]; onClose: () => void;
  onClickDetails?: (id: string | number, rect: DOMRect) => void;
}) {
  const content = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const dialog = content.current?.closest("dialog");
    const previous = document.activeElement as HTMLElement | null;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") { event.preventDefault(); onClose(); } };
    if (dialog && !dialog.open) dialog.showModal?.();
    dialog?.addEventListener("keydown", close);
    dialog?.querySelector<HTMLButtonElement>("button")?.focus();
    return () => { dialog?.removeEventListener("keydown", close); if (dialog?.open) dialog.close(); previous?.focus(); };
  }, [onClose]);
  return <Modal title="Autres cours" leftLabel="Fermer" onLeftClick={onClose} closeButtonAtTop modalBoxStyle="max-w-2xl" dialogAdditionalClass="z-50">
    <div ref={content}>
      <ul className="list mt-5 overflow-hidden rounded-box border border-base-300 bg-base-200">
        {events.map(event => <HierarchicalListRow key={event.id} dismissOverflow={onClose} item={{
          id: event.id, title: event.title, description: event.subtitle,
          subDescription: `${event.date?.toLocaleDateString("fr-FR") ?? ""} · ${event.allDay ? "Sans horaire" : `${event.start} – ${event.end}`}`,
          action: event.to ? <Link to={event.to} state={event.navigationState} className="btn btn-sm btn-square btn-ghost" aria-label={`Accéder au cours ${event.title}`}><ArrowRight className="size-4" /></Link>
            : <button type="button" className="btn btn-sm" onClick={e => { onClickDetails?.(event.id, e.currentTarget.getBoundingClientRect()); onClose(); }}>Détails</button>,
        }} />)}
      </ul>
    </div>
  </Modal>;
}
