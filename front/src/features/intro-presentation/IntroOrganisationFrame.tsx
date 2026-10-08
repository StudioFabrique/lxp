import { Building2 } from "lucide-react";

/**
 * Encadré à plat posé derrière la pyramide au palier d'introduction.
 *
 * L'élément extérieur (`.intro-organisation`) est masqué par le défilement ;
 * l'intérieur (`.intro-organisation-fade`) apparaît après l'animation initiale.
 */
const IntroOrganisationFrame = () => (
  <div
    aria-hidden="true"
    className="intro-organisation pointer-events-none absolute left-1/2 top-1/2 h-[700px] w-[960px] -translate-x-1/2 -translate-y-1/2"
  >
    <div className="intro-organisation-fade flex size-full items-start justify-center gap-3 rounded-3xl border-2 border-dashed border-primary/40 px-8 pt-6 text-primary">
      <span className="grid size-11 place-items-center rounded-xl bg-primary text-primary-content">
        <Building2 className="size-5" aria-hidden="true" />
      </span>
      <b className="text-2xl leading-[2.75rem]">Organisme de formation</b>
    </div>
  </div>
);

export default IntroOrganisationFrame;
