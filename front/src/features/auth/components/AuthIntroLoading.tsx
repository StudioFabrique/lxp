/** Reserve the welcome canvas without flashing a login form skeleton. */
export default function AuthIntroLoading() {
  return <div role="status" aria-label="Préparation de votre accueil" className="flex min-h-64 w-full flex-1 items-center justify-center"><span className="sr-only">Préparation de votre accueil…</span></div>;
}
