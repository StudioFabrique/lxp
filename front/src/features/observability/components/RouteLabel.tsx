/**
 * Méthode et chemin d'une route. Le badge garde une largeur fixe pour que tous
 * les chemins commencent à la même position, et le chemin ne se coupe qu'après
 * une barre oblique, jamais au milieu d'un mot. Le badge est centré sur le
 * chemin, comme les autres cellules de la ligne, même quand il passe sur deux lignes.
 */
export default function RouteLabel({ method, path }: { method: string; path: string }) {
  const segments = path.split("/");

  return (
    <div className="flex items-center gap-2">
      <span className="badge badge-outline badge-sm w-14 shrink-0 justify-center">
        {method}
      </span>
      <span className="min-w-0 font-mono text-xs leading-5">
        {segments.map((segment, index) => (
          <span key={`${segment}-${index}`}>
            {index > 0 && <>/<wbr /></>}
            {segment}
          </span>
        ))}
      </span>
    </div>
  );
}
