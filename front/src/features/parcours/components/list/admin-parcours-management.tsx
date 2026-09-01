import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { PlusCircle } from "lucide-react";

import Header from "../../../../components/headers/Header";
import PermissionGuard from "../../../../components/guards/PermissionGuard";
import FormationModal from "../../../formation/components/FormationModal";
import LastParcoursItem from "../../../dashboard-admin/components/last-parcours-item";
import type { FormationParcoursSummary } from "../../../dashboard-admin/interfaces/parcours-summary";
import { emitOnboardingEvent } from "../../../onboarding/onboarding-events";

type AdminParcoursManagementProps = {
  formations: FormationParcoursSummary[];
  layout: "admin" | "student";
};

const AdminParcoursManagement = ({
  formations,
  layout,
}: AdminParcoursManagementProps) => {
  const isAdmin = layout === "admin";
  const [searchParams, setSearchParams] = useSearchParams();
  const [formationModal, setFormationModal] = useState<{
    isOpen: boolean;
    formationId: number | null;
  }>({
    isOpen: searchParams.get("createFormation") === "true",
    formationId: null,
  });

  useEffect(() => {
    if (searchParams.get("createFormation") === "true") {
      setFormationModal({ isOpen: true, formationId: null });
    }
  }, [searchParams]);

  const openFormationCreation = () => {
    setFormationModal({ isOpen: true, formationId: null });
    emitOnboardingEvent({ type: "formation_entry_clicked" });
  };

  const openFormationEdition = (formationId: number) => {
    setFormationModal({ isOpen: true, formationId });
  };

  const closeFormationModal = () => {
    setFormationModal({ isOpen: false, formationId: null });
    if (searchParams.has("createFormation")) {
      const nextSearchParams = new URLSearchParams(searchParams);
      nextSearchParams.delete("createFormation");
      setSearchParams(nextSearchParams, { replace: true });
    }
  };

  return (
    <main className="w-full flex flex-col gap-8">
      <Header
        title="Gestion des parcours"
        description={
          isAdmin
            ? "Gérez les formations et les parcours qui leur sont associés."
            : "Retrouvez les parcours qui vous sont attribués, regroupés par formation."
        }
      >
        {isAdmin ? (
          <div className="flex flex-wrap justify-end gap-2">
            <PermissionGuard action="write" object="formation">
              <button
                type="button"
                className="btn btn-primary btn-soft"
                data-onboarding="formation-create-entry"
                onClick={openFormationCreation}
              >
                <PlusCircle />
                Créer une formation
              </button>
            </PermissionGuard>
            <PermissionGuard action="write" object="parcours">
              <Link className="btn btn-primary btn-soft" to="new">
                <PlusCircle />
                Créer un parcours
              </Link>
            </PermissionGuard>
          </div>
        ) : null}
      </Header>

      <section
        className="grid items-start gap-5 lg:grid-cols-2 xl:grid-cols-3"
        data-page-tour="parcours-cards"
      >
        {!isAdmin && formations.length === 0 ? (
          <p className="text-base-content/70 italic">
            Aucun parcours ne vous est attribué pour le moment.
          </p>
        ) : null}
        {formations.map((formation) => (
          <LastParcoursItem
            key={formation.id}
            formation={formation}
            isManagementView
            baseRoute={layout}
            onEditFormation={isAdmin ? openFormationEdition : undefined}
          />
        ))}
        {isAdmin ? (
          <LastParcoursItem onCreateFormation={openFormationCreation} />
        ) : null}
      </section>

      {isAdmin && formationModal.isOpen ? (
        <FormationModal
          formationId={formationModal.formationId}
          onClose={closeFormationModal}
        />
      ) : null}
    </main>
  );
};

export default AdminParcoursManagement;
