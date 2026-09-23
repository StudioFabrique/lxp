import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  GraduationCap,
  LayoutDashboard,
  Mail,
  Monitor,
  Palette,
  Rocket,
  ShieldCheck,
  UserRound,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import CursorGlowCard from "./cursor-glow-card";
import Modal from "./modal/modal";
import BoxWrapper from "../wrappers/BoxWrapper";
import { currentRelease, releaseNotes } from "../../config/release-notes";

type Props = {
  onClose: () => void;
};

const changeIcons: Record<string, LucideIcon> = {
  book: BookOpen,
  calendar: CalendarDays,
  clipboard: ClipboardCheck,
  graduation: GraduationCap,
  layout: LayoutDashboard,
  mail: Mail,
  monitor: Monitor,
  palette: Palette,
  rocket: Rocket,
  shield: ShieldCheck,
  user: UserRound,
  users: UsersRound,
};

export default function ReleaseNotesModal({ onClose }: Props) {
  const [selectedVersion, setSelectedVersion] = useState(currentRelease.version);
  const selectedRelease =
    releaseNotes.find(({ version }) => version === selectedVersion) ?? currentRelease;
  const githubUrl = selectedRelease.branch
    ? `https://github.com/StudioFabrique/lxp/tree/${selectedRelease.branch}`
    : selectedRelease.commit
      ? `https://github.com/StudioFabrique/lxp/tree/${selectedRelease.commit}`
      : "https://github.com/StudioFabrique/lxp";

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const closeButton = document.querySelector<HTMLButtonElement>(
      "#my_modal_4 button",
    );
    closeButton?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus();
    };
  }, [onClose]);

  return createPortal(
    <Modal
      title="Notes de version"
      closeButtonAtTop
      leftLabel="Fermer"
      onLeftClick={onClose}
      headerActions={
        <>
          <label htmlFor="release-notes-version" className="sr-only">
            Version
          </label>
          <select
            id="release-notes-version"
            value={selectedVersion}
            onChange={(event) => setSelectedVersion(event.target.value)}
            className="select select-sm w-auto max-w-full border-base-300 bg-base-200 text-base-content focus-visible:outline-primary"
          >
            {releaseNotes.map(({ version, status }) => (
              <option key={version} value={version}>
                {version} · {status}
              </option>
            ))}
          </select>
        </>
      }
      modalBoxStyle="max-w-2xl text-left"
      dialogAdditionalClass="text-left"
    >
      <div className="mt-5 space-y-4">
        <CursorGlowCard
          autoGlow
          glowColor="accent"
          glowSize={3.2}
          className="bg-primary"
        >
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={
              selectedRelease.branch
                ? `Voir la branche ${selectedRelease.branch} sur GitHub (nouvel onglet)`
                : selectedRelease.commit
                  ? `Voir le code associé à la version ${selectedRelease.version} sur GitHub (nouvel onglet)`
                  : "Voir le dépôt GitHub d’ANDRIA (nouvel onglet)"
            }
            className="group block cursor-pointer rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <BoxWrapper className="relative h-auto gap-2 overflow-hidden border-primary bg-transparent p-6 text-primary-content transition-colors group-hover:border-primary-content/40">
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 select-none text-6xl font-black leading-none text-primary-content/20 sm:right-6 sm:text-8xl" aria-hidden="true">
                {selectedRelease.version}
              </span>
              <div className="relative z-10 flex items-center gap-2">
                <h2 className="text-2xl font-bold">ANDRIA</h2>
                <span className="badge border-primary-content/30 bg-primary-content/15 text-primary-content">
                  {selectedRelease.status}
                </span>
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-primary-content/20 bg-primary-content/10 text-primary-content transition-colors group-hover:bg-primary-content/20">
                  <svg
                    className="size-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M12 .297a12 12 0 0 0-3.793 23.385c.6.111.82-.261.82-.577v-2.04c-3.338.726-4.043-1.416-4.043-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.304.762-1.604-2.665-.304-5.466-1.333-5.466-5.93 0-1.311.469-2.381 1.236-3.221-.124-.303-.536-1.524.117-3.176 0 0 1.008-.323 3.301 1.23a11.52 11.52 0 0 1 6.004 0c2.291-1.553 3.297-1.23 3.297-1.23.655 1.652.243 2.873.12 3.176.77.84 1.235 1.91 1.235 3.221 0 4.609-2.803 5.624-5.475 5.921.43.371.823 1.102.823 2.222v3.293c0 .319.216.694.825.576A12.001 12.001 0 0 0 12 .297Z" />
                  </svg>
                </span>
              </div>
              <p className="relative z-10 max-w-md pr-10 text-sm text-primary-content/80">
                {selectedRelease.summary}
              </p>
            </BoxWrapper>
          </a>
        </CursorGlowCard>
        <div className="grid gap-3 sm:grid-cols-2">
          {selectedRelease.changes.map(({ title, description, icon }, index) => {
            const Icon = changeIcons[icon ?? "layout"] ?? LayoutDashboard;
            return (
              <BoxWrapper
                key={`${index}-${title}`}
                className="h-auto gap-2 border-base-300 bg-base-200 p-4"
              >
                <div className="flex items-center gap-2">
                  <Icon className="size-5 shrink-0 text-primary" aria-hidden="true" />
                  <h3 className="text-sm font-semibold text-base-content">
                    {title}
                  </h3>
                </div>
                <p className="text-sm leading-5 text-base-content/70">
                  {description}
                </p>
              </BoxWrapper>
            );
          })}
        </div>
      </div>
    </Modal>,
    document.body,
  );
}
