import { ArrowUpRight, Compass } from "lucide-react";
import { Link } from "react-router";
import CursorGlowCard from "../../../components/UI/cursor-glow-card";
import ReleaseNotesCard from "../../../components/UI/ReleaseNotesCard";

export default function WelcomeActions() {
  return (
    <div className="mt-3 grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
      <CursorGlowCard
        autoGlow
        glowColor="accent"
        glowSize={3.2}
        className="h-full bg-primary shadow-sm sm:col-span-2"
      >
        <Link
          to="/demo"
          aria-label="Explorer la démo sans compte ni accès administrateur"
          className="relative flex h-full min-h-28 flex-col justify-center overflow-hidden rounded-xl border border-primary px-5 py-4 text-left text-primary-content focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <span className="relative z-10 flex items-center gap-2 text-base font-semibold">
            Explorer la démo
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </span>
          <span className="relative z-10 mt-1 block text-sm text-primary-content/75">
            Découvrez la plateforme librement, sans compte.
          </span>
          <Compass
            className="pointer-events-none absolute -bottom-7 right-4 size-28 text-primary-content/10"
            aria-hidden="true"
          />
        </Link>
      </CursorGlowCard>
      <ReleaseNotesCard />
    </div>
  );
}
