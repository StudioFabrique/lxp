import { Building2 } from "lucide-react";

import { readableTextColor } from "../../utils/helpers/color-helpers";
import IntroExampleBadge from "./IntroExampleBadge";

type Props = {
  /** Nom de l'organisme, affiché en grand dans le cadre. */
  name: string;
  isPlaceholder: boolean;
  logoUrl: string | null;
  /** Fond coloré de l'instance : il appartient au cadre et disparaît avec lui. */
  backgroundColor?: string;
};

/**
 * Encadré à plat posé derrière la pyramide au palier d'introduction.
 *
 * L'élément extérieur (`.intro-organisation`) est masqué par le défilement ;
 * l'intérieur (`.intro-organisation-fade`) apparaît après l'animation initiale.
 * Le titre est au-dessus du cadre ; le fond coloré du logo appartient au cadre
 * et disparaît avec lui, d'où la couleur du nom, choisie selon ce fond. Le cadre
 * affiche le logo s'il existe, sinon le nom.
 */
const IntroOrganisationFrame = ({
  name,
  isPlaceholder,
  logoUrl,
  backgroundColor,
}: Props) => {
  const textColor = backgroundColor ? readableTextColor(backgroundColor) : undefined;

  return (
    <div
      aria-hidden="true"
      className="intro-organisation pointer-events-none absolute left-1/2 top-1/2 h-[700px] w-[960px] -translate-x-1/2 -translate-y-1/2"
    >
      <div className="intro-organisation-fade relative size-full">
        {/* Titre juste au-dessus du cadre, sur le fond de la page. */}
        <div className="absolute inset-x-0 -top-12 flex justify-center">
          <span className="flex items-center gap-2 text-primary">
            <Building2 className="size-6" aria-hidden="true" />
            <b className="text-xl leading-10">Organisme de formation</b>
          </span>
        </div>
        <div
          style={{ backgroundColor, color: textColor }}
          className="flex size-full flex-col items-center gap-4 rounded-3xl border-2 border-dashed border-primary/40 px-8 pt-8 text-base-content"
        >
          {/* Le logo porte déjà le nom de l'organisme : l'un ou l'autre, jamais les deux. */}
          {logoUrl ? (
            <img
              src={logoUrl}
              alt=""
              className="h-16 max-w-[16rem] object-contain"
            />
          ) : (
            <p className="flex items-center gap-3 text-5xl font-extrabold leading-none">
              {name}
              {isPlaceholder ? <IntroExampleBadge /> : null}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default IntroOrganisationFrame;
