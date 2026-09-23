import { useContext } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  Component,
  RotateCw,
  Users,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import CursorGlowCard from "../../../components/UI/cursor-glow-card";
import BoxWrapper from "../../../components/wrappers/BoxWrapper";
import PageWrapper from "../../../components/wrappers/PageWrapper";
import { AbilityContext } from "../../../rbac/AbilityProvider";
import type { AppSubject } from "../../../rbac/ability";

const shortcuts: {
  label: string;
  description: string;
  to: string;
  subject: AppSubject;
  icon: typeof Users;
}[] = [
  {
    label: "Utilisateurs",
    description: "Retrouver les comptes et les profils.",
    to: "/admin/user",
    subject: "user",
    icon: Users,
  },
  {
    label: "Parcours",
    description: "Consulter les parcours de formation.",
    to: "/admin/parcours",
    subject: "parcours",
    icon: BookOpen,
  },
  {
    label: "Modules",
    description: "Accéder aux modules pédagogiques.",
    to: "/admin/module",
    subject: "module",
    icon: Component,
  },
];

export default function AdminNotFound() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const ability = useContext(AbilityContext);
  const availableShortcuts = shortcuts.filter(({ subject }) =>
    ability.can("read", subject),
  );
  const isDashboardPath = pathname.replace(/\/+$/, "") === "/admin/dashboard";

  return (
    <PageWrapper className="gap-6">
      <CursorGlowCard
        autoGlow
        glowColor="accent"
        glowSize={3.2}
        className="bg-primary"
      >
        <BoxWrapper className="min-h-80 justify-center gap-5 border-primary bg-transparent px-7 py-12 text-primary-content sm:px-12">
          <h1 className="relative z-10 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
            Cette page est introuvable
          </h1>
          <p className="relative z-10 max-w-xl text-primary-content/80">
            L’adresse n’existe pas ou la page a été déplacée. Retrouvez vos
            outils depuis le tableau de bord.
          </p>
          <div className="relative z-10 mt-2 flex flex-wrap gap-3">
            <button
              type="button"
              className="btn border-primary-content/40 bg-transparent text-primary-content hover:bg-primary-content/10"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="size-4" aria-hidden="true" /> Page
              précédente
            </button>
            {isDashboardPath ? (
              <button
                type="button"
                className="btn border-primary-content bg-primary-content text-primary hover:bg-primary-content/90"
                onClick={() => window.location.reload()}
              >
                <RotateCw className="size-4" aria-hidden="true" /> Réessayer
              </button>
            ) : (
              <Link
                to="/admin/dashboard"
                className="btn border-primary-content bg-primary-content text-primary hover:bg-primary-content/90"
              >
                Tableau de bord
              </Link>
            )}
          </div>
          <span
            className="pointer-events-none absolute bottom-0 right-6 hidden select-none text-[clamp(8rem,18vw,15rem)] font-black leading-none text-primary-content/10 lg:block"
            aria-hidden="true"
          >
            404
          </span>
        </BoxWrapper>
      </CursorGlowCard>

      {availableShortcuts.length > 0 && (
        <section aria-labelledby="admin-shortcuts-title" className="space-y-4">
          <div>
            <h2 id="admin-shortcuts-title" className="text-xl font-semibold">
              Accès rapides
            </h2>
            <p className="text-sm text-base-content/70">
              Rejoignez directement une rubrique de l’administration.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {availableShortcuts.map(
              ({ label, description, to, icon: Icon }) => (
                <BoxWrapper key={to} className="h-auto gap-3">
                  <Icon className="size-6 text-primary" aria-hidden="true" />
                  <h3 className="font-semibold">{label}</h3>
                  <p className="text-sm text-base-content/70">{description}</p>
                  <Link
                    to={to}
                    className="btn btn-outline btn-primary btn-sm mt-auto w-fit gap-2"
                  >
                    Ouvrir {label.toLowerCase()}{" "}
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </Link>
                </BoxWrapper>
              ),
            )}
          </div>
        </section>
      )}
    </PageWrapper>
  );
}
