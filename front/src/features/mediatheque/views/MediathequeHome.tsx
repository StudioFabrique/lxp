import { useEffect, useState } from "react";
import { File, Image, Music, Video } from "lucide-react";

import EmptyStatePlaceholder from "../../../components/UI/empty-state-placeholder";
import { HierarchicalListRow } from "../../../components/UI/hierarchical-list-card/HierarchicalListRow";
import Modal from "../../../components/UI/modal/modal";
import MultiCriteriaSearch from "../../../components/UI/multi-criteria-search";
import Header from "../../../components/headers/Header";
import TablePagination from "../../../components/table/TablePagination";
import PageWrapper from "../../../components/wrappers/PageWrapper";
import activityIconType from "../../../utils/helpers/activity-icon-type";
import type { Activity } from "../../../utils/interfaces/activity";
import MediaList, { MediaPreview } from "../components/media-list";
import usePaginatedMediatheque from "../hooks/use-paginated-mediatheque";
import type Media from "../interfaces/media";
import type {
  MediaAssociatedActivity,
  MediaType,
} from "../interfaces/media";

const mediaTypes: {
  type: MediaType;
  label: string;
  icon: React.ReactNode;
}[] = [
  { type: "image", label: "Images", icon: <Image /> },
  { type: "video", label: "Vidéos", icon: <Video /> },
  { type: "audio", label: "Audios", icon: <Music /> },
  { type: "resource", label: "Fichiers", icon: <File /> },
];

const sortOptions = [
  { value: "createdAt", label: "Date de création" },
  { value: "name", label: "Nom du fichier" },
  { value: "size", label: "Taille" },
  { value: "used", label: "Nombre d’utilisations" },
] as const;

const getActivityDestination = (activity: MediaAssociatedActivity) => {
  if (
    activity.parent === "lesson" &&
    activity.moduleId !== undefined &&
    activity.lessonId !== undefined
  ) {
    return {
      to: `/admin/parcours/module/${activity.moduleId}`,
      state: { lessonId: activity.lessonId, activityId: activity.id },
    };
  }

  if (activity.parent === "resource" && activity.resourceId !== undefined) {
    return {
      to: `/admin/resources/edit/${activity.resourceId}?activityId=${activity.id}`,
    };
  }

  return {};
};

const activityContext = (activity: MediaAssociatedActivity) => {
  if (activity.parent === "resource") {
    return `Ressource supplémentaire · ${activity.parentTitle}`;
  }

  return [activity.moduleTitle, activity.courseTitle, activity.parentTitle]
    .filter(Boolean)
    .join(" · ");
};

function MediathequeHomePage() {
  const [searchInput, setSearchInput] = useState("");
  const [previewedMedia, setPreviewedMedia] = useState<Media | null>(null);
  const [activityMedia, setActivityMedia] = useState<Media | null>(null);
  const {
    error,
    isLoading,
    list,
    page,
    perPage,
    refetch,
    setLimit,
    setPage,
    setSearch,
    setSort,
    setType,
    total,
    totalPages,
    type,
  } = usePaginatedMediatheque<Media>("mediatheque");

  useEffect(() => {
    const timer = window.setTimeout(() => setSearch(searchInput.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [searchInput, setSearch]);

  return (
    <PageWrapper as="main">
      <Header
        title="Médiathèque"
        description="Gérez toutes les ressources utilisées dans l’application."
      />

      <div
        role="tablist"
        aria-label="Type de média"
        className="tabs tabs-box overflow-x-auto"
      >
        {mediaTypes.map((mediaType) => (
          <button
            key={mediaType.type}
            type="button"
            role="tab"
            aria-selected={type === mediaType.type}
            className={`tab gap-2 ${type === mediaType.type ? "tab-active" : ""}`}
            onClick={() => setType(mediaType.type)}
          >
            <span className="size-4 [&>svg]:size-4" aria-hidden="true">
              {mediaType.icon}
            </span>
            {mediaType.label}
          </button>
        ))}
      </div>

      <MultiCriteriaSearch
        value={searchInput}
        onChange={setSearchInput}
        criteria={["nom du fichier"]}
        placeholder="Rechercher un média..."
        actions={
          <label className="select select-bordered">
            <span className="label">Trier par</span>
            <select
              defaultValue="createdAt"
              aria-label="Trier les médias"
              onChange={(event) =>
                setSort(
                  event.currentTarget.value as
                    | "createdAt"
                    | "name"
                    | "size"
                    | "used",
                )
              }
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        }
      />

      {isLoading ? (
        <div role="status" className="skeleton h-64">
          Chargement des médias…
        </div>
      ) : error ? (
        <div role="alert" className="alert alert-error">
          {error}
          <button type="button" className="btn btn-sm" onClick={refetch}>
            Réessayer
          </button>
        </div>
      ) : list.length > 0 ? (
        <MediaList
          medias={list as Media[]}
          onPreview={setPreviewedMedia}
          onShowActivities={setActivityMedia}
        />
      ) : (
        <EmptyStatePlaceholder
          title={
            searchInput.trim()
              ? "Aucun média trouvé"
              : "Aucun média disponible"
          }
        />
      )}

      {total > 0 ? (
        <TablePagination
          currentPage={page}
          maxPage={totalPages}
          itemsPerPage={perPage}
          leftText={`Médias : ${total}`}
          onSetCurrentPage={setPage}
          onSetItemsPerPage={(value) => {
            setLimit(value);
            setPage(1);
          }}
          onSetPreviousPage={() => setPage(Math.max(1, page - 1))}
          onSetNextPage={() => setPage(Math.min(totalPages, page + 1))}
        />
      ) : null}

      {previewedMedia ? (
        <Modal
          title={previewedMedia.name}
          leftLabel="Fermer"
          onLeftClick={() => setPreviewedMedia(null)}
          closeButtonAtTop
          modalBoxStyle="flex h-[calc(100dvh-2rem)] max-h-none w-[calc(100vw-2rem)] max-w-none flex-col"
          dialogAdditionalClass="z-30"
        >
          <div className="mt-4 min-h-0 grow overflow-hidden rounded-box bg-base-200 p-2">
            <MediaPreview media={previewedMedia} />
          </div>
        </Modal>
      ) : null}

      {activityMedia ? (
        <Modal
          title={`Activités associées à ${activityMedia.name}`}
          leftLabel="Fermer"
          onLeftClick={() => setActivityMedia(null)}
          modalBoxStyle="max-w-3xl"
          dialogAdditionalClass="z-30"
        >
          {activityMedia.associatedActivities.length > 0 ? (
            <ul className="list mt-5 overflow-hidden rounded-box border border-base-300 bg-base-200">
              {activityMedia.associatedActivities.map((activity, index) => (
                <HierarchicalListRow
                  key={`${activity.parent}-${activity.id}`}
                  dismissOverflow={() => setActivityMedia(null)}
                  hideDivider={
                    index === activityMedia.associatedActivities.length - 1
                  }
                  item={{
                    id: `${activity.parent}-${activity.id}`,
                    title: activity.title,
                    description: `Activité ${activity.order + 1}`,
                    subDescription: activityContext(activity),
                    icon: activityIconType(activity.type as Activity["type"]),
                    ...getActivityDestination(activity),
                  }}
                />
              ))}
            </ul>
          ) : (
            <p className="py-10 text-center text-sm opacity-60">
              Aucune activité associée à ce média.
            </p>
          )}
        </Modal>
      ) : null}
    </PageWrapper>
  );
}

export default MediathequeHomePage;
