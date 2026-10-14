import { Building2 } from "lucide-react";

import { readableTextColor } from "../../utils/helpers/color-helpers";

type Props = {
  /** Nom de l'organisme, affiché en grand dans le cadre. */
  name: string;
  logoUrl: string | null;
  /** Fond coloré de l'instance : il appartient au cadre et disparaît avec lui. */
  backgroundColor?: string;
};

/**
 * Au palier d'introduction : un cadre en tirets entoure la pyramide, et l'en-tête
 * (titre et logo de l'organisme) est relevé au-dessus.
 *
 * L'élément extérieur (`.intro-organisation`) est masqué par le défilement ;
 * l'intérieur (`.intro-organisation-fade`) apparaît après l'animation initiale.
 * Le titre est au-dessus du cadre ; le fond coloré du logo appartient au cadre
 * et disparaît avec lui, d'où la couleur du nom, choisie selon ce fond. Le cadre
 * affiche le logo s'il existe, sinon le nom.
 */
const IntroOrganisationFrame = ({
  name,
  logoUrl,
  backgroundColor,
}: Props) => {
  const textColor = backgroundColor ? readableTextColor(backgroundColor) : undefined;

  return (
    <div
      aria-hidden="true"
      className="intro-organisation pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[860px] -translate-x-1/2 -translate-y-1/2"
    >
      <div className="intro-organisation-fade relative size-full">
        {/* Cadre en tirets autour de la pyramide, de la même couleur que celui du logo. */}
        <div className="size-full rounded-3xl border-[3px] border-dashed border-primary/60" />
        {/* En-tête relevé au-dessus du cadre : titre, puis logo (ou nom) de l'organisme. */}
        <div className="absolute inset-x-0 bottom-full mb-6 flex flex-col items-center gap-3">
          <span className="flex items-center gap-2 text-primary">
            <Building2 className="size-6" aria-hidden="true" />
            <b className="text-xl leading-10">Organisme de formation</b>
          </span>
          <div
            style={{ backgroundColor, color: textColor }}
            className="flex h-28 w-[380px] items-center justify-center rounded-3xl border-[3px] border-dashed border-primary/60 px-8 text-base-content"
          >
            {/* Le logo porte déjà le nom de l'organisme : l'un ou l'autre, jamais les deux. */}
            {logoUrl ? (
              <img
                src={logoUrl}
                alt=""
                className="h-16 max-w-[16rem] object-contain"
              />
            ) : (
              <p className="flex items-center gap-3 text-3xl font-extrabold leading-none">
                {name}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroOrganisationFrame;
