import { useState } from "react";
import { ArrowUpRight, History } from "lucide-react";
import CursorGlowCard from "./cursor-glow-card";
import ReleaseNotesModal from "./ReleaseNotesModal";
import { currentRelease } from "../../config/release-notes";
import { cn } from "../../utils/cn";

type Props = {
  className?: string;
};

export default function ReleaseNotesCard({ className }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <CursorGlowCard
        autoGlow
        glowColor="info"
        glowSize={2.4}
        className={cn("h-full bg-success shadow-sm", className)}
      >
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label={`Voir les nouveautés de la version ${currentRelease.version} ${currentRelease.status}`}
          className="relative flex h-full min-h-28 w-full cursor-pointer flex-col justify-center overflow-hidden rounded-xl border border-success px-5 py-4 text-left text-success-content focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-success"
        >
          <span className="relative z-10 flex items-center gap-1 text-base font-semibold">
            Version {currentRelease.version}
            <ArrowUpRight className="size-4 shrink-0" aria-hidden="true" />
          </span>
          <span className="relative z-10 mt-1 text-sm text-success-content/80">
            {currentRelease.status} · Nouveautés
          </span>
          <History
            className="pointer-events-none absolute -bottom-5 -right-3 size-24 text-success-content/10"
            aria-hidden="true"
          />
        </button>
      </CursorGlowCard>
      {isOpen && <ReleaseNotesModal onClose={() => setIsOpen(false)} />}
    </>
  );
}
