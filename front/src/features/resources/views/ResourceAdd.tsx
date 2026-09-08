import { useContext, useState } from "react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Edit,
} from "lucide-react";
import { Link } from "react-router";
import Header from "../../../components/headers/Header";
import PageWrapper from "../../../components/wrappers/PageWrapper";
import Modal from "../../../components/UI/modal/modal";
import EmptyStatePlaceholder from "../../../components/UI/empty-state-placeholder";
import ActivityFloatingActionButton from "../../../components/UI/ActivityFloatingActionButton";
import ActivityActionsMenu from "../../module-preview/components/preview/activity-actions-menu";
import ResourceForm from "../components/add/ResourceForm";
import ActivityContent from "../components/add/ActivityContent";
import useResource from "../hooks/useResource";
import { AbilityContext } from "../../../rbac/AbilityProvider";
import activityIconType from "../../../utils/helpers/activity-icon-type";

export default function ResourceAdd({
  readOnly = false,
}: {
  readOnly?: boolean;
}) {
  const [showSettings, setShowSettings] = useState(false);
  const state = useResource({
    onResourceSaved: () => setShowSettings(false),
  });
  const ability = useContext(AbilityContext);
  const [panelClosed, setPanelClosed] = useState(false);
  const canEdit = !readOnly && ability.can("update", "resource");
  const canCreateActivity = !readOnly && ability.can("write", "resource");
  const activities = state.resource?.activities ?? [];
  const selectedIndex = activities.findIndex(
    (activity) => activity.id === state.previewActivity?.id,
  );
  const form = (
    <ResourceForm
      mode={state.mode}
      data={state.data}
      onSubmit={state.handleSubmitForm}
      isLoading={state.isSubmitting}
      tags={state.tags}
      setTags={state.setTags}
      tagError={state.tagError}
      onTagError={state.setTagError}
      onSetFile={state.setFile}
      showSubmitButton={!showSettings}
    />
  );

  return (
    <PageWrapper as="main">
      <Header
        title={state.resource?.title ?? "Nouvelle ressource supplémentaire"}
        description={
          state.resource?.description ??
          "Enregistrez la ressource pour y ajouter des activités."
        }
      >
        <div className="flex flex-wrap gap-2">
          {state.resourceId && canEdit && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowSettings(true)}
            >
              <Edit /> Modifier les détails de la ressource
            </button>
          )}
          <Link
            className="btn btn-primary btn-soft"
            to={readOnly ? "/student/ressources" : "/admin/resources"}
          >
            <ArrowLeft /> Retour aux ressources
          </Link>
        </div>
      </Header>
      {state.isLoading ? (
        <div role="status" className="skeleton h-96">
          Chargement de la ressource…
        </div>
      ) : state.error ? (
        <div role="alert" className="alert alert-error">
          {state.error}
        </div>
      ) : !state.resourceId ? (
        <div className="max-w-2xl rounded-lg border border-base-300 bg-base-200 p-6">
          {form}
        </div>
      ) : (
        <>
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="btn btn-primary"
              aria-label={
                panelClosed ? "Afficher les activités" : "Masquer les activités"
              }
              onClick={() => setPanelClosed(!panelClosed)}
            >
              {panelClosed ? <PanelLeftOpen /> : <PanelLeftClose />}
            </button>
            <div className="flex-1 rounded-lg border border-secondary/20 bg-secondary/20 px-4 py-2 text-sm">
              {activities.length} activité{activities.length > 1 ? "s" : ""}
            </div>
          </div>
          <div
            className={`grid items-start gap-5 ${panelClosed ? "" : "lg:grid-cols-3"}`}
          >
            {!panelClosed && (
              <aside className="min-w-0 rounded-lg border border-base-300 bg-base-200 p-3">
                <h2 className="px-2 pb-3 font-semibold">Activités</h2>
                {activities.length ? (
                  <ul className="flex flex-col gap-2">
                    {activities.map((activity) => (
                      <li
                        key={activity.id}
                        className={`flex cursor-pointer items-center gap-2 rounded-lg p-2 ${state.previewActivity?.id === activity.id ? "bg-primary/10" : "hover:bg-base-300"}`}
                      >
                        <button
                          type="button"
                          className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 text-left"
                          aria-current={
                            state.previewActivity?.id === activity.id
                              ? "true"
                              : undefined
                          }
                          onClick={() => state.setPreviewActivity(activity)}
                        >
                          <span className="shrink-0 text-primary">
                            {activityIconType(activity.type)}
                          </span>
                          <span className="truncate text-sm">
                            {activity.title}
                          </span>
                        </button>
                        {!readOnly && (
                          <ActivityActionsMenu
                            activity={activity}
                            permissionSubject="resource"
                            onEditActivity={state.setEditActivity}
                            onOpenDeleteModal={state.setActivityToDelete}
                            disabled={state.isSubmitting}
                          />
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="p-2 text-sm text-base-content/60">
                    Aucune activité pour le moment.
                  </p>
                )}
              </aside>
            )}
            <section
              className={`relative min-w-0 min-h-[60vh] pb-28 ${panelClosed ? "" : "lg:col-span-2"}`}
            >
              {state.activityType ? (
                <ActivityContent
                  key={`${state.resourceId}-${state.previewActivity?.id ?? "new"}-${state.activityType}-${state.activityState}-${state.previewActivity?.updatedAt ?? ""}`}
                  parentId={state.resourceId}
                  activity={state.previewActivity ?? undefined}
                  activityType={state.activityType}
                  mode={state.activityState}
                  canEdit={
                    state.activityState === "write"
                      ? canCreateActivity
                      : canEdit
                  }
                  onClose={state.closePreviewActivity}
                  onEdit={() =>
                    state.previewActivity &&
                    state.setEditActivity(state.previewActivity)
                  }
                  onDelete={() =>
                    state.setActivityToDelete(state.previewActivity)
                  }
                  onRefresh={state.refreshActivityList}
                />
              ) : (
                <EmptyStatePlaceholder
                  title={
                    readOnly
                      ? "Aucune activité disponible"
                      : "Ajoutez une activité à cette ressource"
                  }
                />
              )}
              {state.activityState === "read" && selectedIndex >= 0 && (
                <nav
                  className="flex justify-end gap-2"
                  aria-label="Navigation entre les activités"
                >
                  <button
                    type="button"
                    className="btn btn-outline btn-primary"
                    disabled={selectedIndex === 0}
                    onClick={() =>
                      state.setPreviewActivity(activities[selectedIndex - 1])
                    }
                  >
                    <ChevronLeft /> Précédente
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={selectedIndex === activities.length - 1}
                    onClick={() =>
                      state.setPreviewActivity(activities[selectedIndex + 1])
                    }
                  >
                    Suivante <ChevronRight />
                  </button>
                </nav>
              )}
              {canCreateActivity && state.activityState === "read" && (
                <ActivityFloatingActionButton
                  onTypeSelection={state.createNewActivity}
                />
              )}
            </section>
          </div>
        </>
      )}
      {showSettings && (
        <Modal
          title="Modifier les détails de la ressource"
          leftLabel="Fermer"
          onLeftClick={() => setShowSettings(false)}
          rightLabel="Mettre à jour la ressource"
          onRightClick={state.handleSubmitForm}
          isSubmitting={state.isSubmitting}
          actionsClassName="w-full justify-between"
          rightClassName="btn-primary text-primary-content"
        >
          {form}
        </Modal>
      )}
      {state.activityToDelete && (
        <Modal
          title="Supprimer une activité"
          leftLabel="Annuler"
          rightLabel="Supprimer"
          isSubmitting={state.isSubmitting}
          onLeftClick={() => state.setActivityToDelete(null)}
          onRightClick={state.handleDeleteActivity}
        >
          L'activité « {state.activityToDelete.title} » et ses fichiers seront
          supprimés définitivement.
        </Modal>
      )}
    </PageWrapper>
  );
}
