import AuthPageWrapper from "./AuthPageWrapper";

export default function LoginLoadingSkeleton() {
  return (
    <div role="status" aria-label="Chargement de la connexion" className="w-full">
      <span className="sr-only">Chargement de la connexion…</span>
      <AuthPageWrapper title="Connectez-vous à votre espace">
        <div className="flex flex-col gap-4" aria-hidden="true">
          <div className="skeleton h-12 w-full rounded-lg" />
          <div className="skeleton h-12 w-full rounded-lg" />
          <div className="skeleton mt-2 h-10 w-full rounded-lg" />
          <div className="skeleton mx-auto mt-2 h-5 w-36 rounded-lg" />
        </div>
      </AuthPageWrapper>
    </div>
  );
}
