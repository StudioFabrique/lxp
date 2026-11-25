import type { ActivityTarget } from "../api/observability.api";

type Props = {
  method: string;
  path: string;
  /** Contenus désignés par le chemin (leçon, groupe...), affichés sous la route. */
  targets?: ActivityTarget[];
};

/**
 * Méthode et chemin d'une route. Le badge garde une largeur fixe pour que tous
 * les chemins commencent à la même position, et le chemin ne se coupe qu'après
 * une barre oblique, jamais au milieu d'un mot. Le badge est centré sur le
 * chemin, comme les autres cellules de la ligne, même quand il passe sur deux lignes.
 */
export default function RouteLabel({ method, path, targets = [] }: Readonly<Props>) {
  const segments = path.split("/");

  return (
    <div className="flex items-center gap-2">
      <span className="badge badge-outline badge-sm w-14 shrink-0 justify-center">
        {method}
      </span>
      <div className="min-w-0">
        <span className="font-mono text-xs leading-5">
          {segments.map((segment, index) => (
            <span key={`${segment}-${index}`}>
              {index > 0 && <>/<wbr /></>}
              {segment}
            </span>
          ))}
        </span>
        {targets.length > 0 && (
          <ul className="mt-0.5">
            {targets.map((target) => (
              <li key={`${target.kind}-${target.id}`} className="text-xs text-base-content/80">
                <span className="font-semibold">{target.kind} :</span>{" "}
                {target.label ?? <span className="italic">introuvable</span>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
