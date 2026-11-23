export type StatusClass = {
  key: "success" | "redirect" | "client" | "server";
  label: string;
  /** Classe DaisyUI complète, écrite en toutes lettres pour être détectée à la compilation. */
  progressClassName: string;
  count: number;
};

const classes: Omit<StatusClass, "count">[] = [
  { key: "success", label: "Succès (2xx)", progressClassName: "progress-success" },
  { key: "redirect", label: "Redirections et cache (3xx)", progressClassName: "progress-info" },
  { key: "client", label: "Erreurs côté client (4xx)", progressClassName: "progress-warning" },
  { key: "server", label: "Erreurs côté serveur (5xx)", progressClassName: "progress-error" },
];

const classIndex = (status: string): number => {
  const family = Number(status.slice(0, 1));
  return family >= 2 && family <= 5 ? family - 2 : -1;
};

/** Regroupe les codes HTTP par famille ; les codes inconnus sont ignorés. */
export function groupStatusByClass(
  breakdown: { status: string; count: number }[],
): StatusClass[] {
  const counts = classes.map(() => 0);
  for (const { status, count } of breakdown) {
    const index = classIndex(status);
    if (index >= 0) counts[index] += count;
  }
  return classes.map((entry, index) => ({ ...entry, count: counts[index] }));
}
