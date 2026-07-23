import { Link } from "react-router";

export default function AccessDenied() {
  return (
    <main className="min-h-screen grid place-items-center p-6">
      <div className="max-w-lg text-center space-y-4">
        <h1 className="text-3xl font-semibold">Accès refusé</h1>
        <p className="text-base-content/70">
          Votre rôle actuel ne permet pas d’accéder à cette page.
        </p>
        <Link className="btn btn-primary" to="/">
          Revenir à l’accueil
        </Link>
      </div>
    </main>
  );
}

