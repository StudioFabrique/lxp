export default function ActivityContentSkeleton() {
  return (
    <div role="status" aria-label="Chargement de l’activité" className="space-y-4">
      <span className="sr-only">Chargement de l’activité…</span>
      <div className="skeleton h-4 w-full" aria-hidden="true" />
      <div className="skeleton h-4 w-11/12" aria-hidden="true" />
      <div className="skeleton h-4 w-4/5" aria-hidden="true" />
      <div className="skeleton h-4 w-2/3" aria-hidden="true" />
    </div>
  );
}
