import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import type { RoleCounts } from "../api/role.api";
import RoleCard from "./RoleCard";

vi.mock("../../../components/guards/PermissionGuard", () => ({
  default: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock("../../../components/UI/cursor-glow-card", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

const role: RoleCounts = {
  _id: "role-id",
  role: "editor",
  label: "Éditeur",
  rank: 2,
  model: "équipe pédagogique",
  protection: 0,
  countRead: 12,
  countWrite: 8,
  countUpdate: 6,
  countDelete: 2,
};

const renderCard = (overrides: Partial<RoleCounts> = {}) =>
  renderToStaticMarkup(
    <RoleCard
      role={{ ...role, ...overrides }}
      onEdit={vi.fn()}
      onReset={vi.fn()}
      onDuplicate={vi.fn()}
      onDelete={vi.fn()}
      onOpenPermissions={vi.fn()}
    />,
  );

describe("RoleCard", () => {
  it("présente les quatre familles de permissions et leurs compteurs", () => {
    const markup = renderCard();

    expect(markup).toContain("Lecture");
    expect(markup).toContain("Écriture");
    expect(markup).toContain("Modification");
    expect(markup).toContain("Suppression");
    for (const count of [12, 8, 6, 2]) {
      expect(markup).toContain(`>${count}</span>`);
    }
    expect(markup).toContain("text-info");
    expect(markup).toContain("text-success");
    expect(markup).toContain("text-warning");
    expect(markup).toContain("text-error");
    expect(markup).toContain("group/row");
    expect(markup).toContain("group-hover/row:opacity-100");
    expect(markup).toContain("transition-opacity");
    expect(markup).not.toContain("group-hover:visible");
  });

  it("conserve les actions autorisées mais masque la suppression d'un rôle protégé", () => {
    const markup = renderCard({ protection: 2 });

    expect(markup).toContain("Modifier les détails du rôle Éditeur");
    expect(markup).toContain("Réinitialiser les permissions du rôle Éditeur");
    expect(markup).toContain("Dupliquer le rôle Éditeur");
    expect(markup).not.toContain("Supprimer le rôle Éditeur");
    expect(markup).toContain('data-tip="Rôle protégé"');
  });
});
