import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import ResourcesHeader from "../components/list/ResourcesHeader";
import CreateResourceModal from "../components/add/CreateResourceModal";
import ResourcesListCard from "../components/list/ResourcesListCard";
import PageWrapper from "../../../components/wrappers/PageWrapper";
import MultiCriteriaSearch from "../../../components/UI/multi-criteria-search";
import EmptyStatePlaceholder from "../../../components/UI/empty-state-placeholder";
import TablePagination from "../../../components/table/TablePagination";
import Modal from "../../../components/UI/modal/modal";
import {
  getStoredItemsPerPage,
  storeItemsPerPage,
} from "../../../components/table/pagination-storage";
import { getApiErrorMessage } from "../../../utils/helpers/api-error-message";
import { resourcesApi } from "../api/resources.api";
import { resourcesKeys } from "../api/resources.keys";
import { Activity } from "../../../utils/interfaces/activity";

export type ResourceListItem = {
  id: number;
  title: string;
  author: string;
  description?: string;
  createdAt: string;
  imageUrl?: string | null;
  activities?: Pick<Activity, "id" | "title" | "type" | "order">[];
};

export default function ResourcesHome() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [resourceToDelete, setResourceToDelete] =
    useState<ResourceListItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(() =>
    getStoredItemsPerPage("admin-resources", 15),
  );
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(search.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);
  const query = useQuery<{ list: ResourceListItem[]; total: number }>({
    queryKey: [...resourcesKeys.list(), { page, limit, searchTerm }],
    queryFn: () =>
      resourcesApi.queries.getList({
        stype: "title",
        sdir: "asc",
        page,
        limit,
        searchTerm: searchTerm || undefined,
      }),
  });
  const total = query.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  useEffect(() => {
    if (query.data && page > totalPages) setPage(totalPages);
  }, [query.data, page, totalPages]);

  const handleDeleteResource = async () => {
    if (!resourceToDelete || deleting) return;
    setDeleting(true);
    try {
      const result = await resourcesApi.mutations.remove(resourceToDelete.id);
      if (!result.success) throw new Error(result.message);
      toast.success(result.message);
      setResourceToDelete(null);
      await query.refetch();
    } catch (err) {
      toast.error(
        getApiErrorMessage(err, "La ressource n'a pas pu être supprimée."),
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <PageWrapper as="main">
      <ResourcesHeader onCreate={() => setShowCreateModal(true)} />
      {showCreateModal && (
        <CreateResourceModal onClose={() => setShowCreateModal(false)} />
      )}
      <MultiCriteriaSearch
        value={search}
        onChange={setSearch}
        criteria={["titre", "description", "auteur", "tags"]}
        placeholder="Rechercher une ressource..."
      />
      {query.isPending ? (
        <div role="status" className="skeleton h-64">
          Chargement des ressources…
        </div>
      ) : query.isError ? (
        <div role="alert" className="alert alert-error">
          {getApiErrorMessage(
            query.error,
            "Les ressources n'ont pas pu être chargées.",
          )}
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => query.refetch()}
          >
            Réessayer
          </button>
        </div>
      ) : (
        <ResourcesListCard
          resourcesList={query.data.list}
          onDeleteResource={setResourceToDelete}
        >
          <EmptyStatePlaceholder
            title={
              searchTerm
                ? "Aucune ressource trouvée"
                : "Aucune ressource disponible"
            }
          />
        </ResourcesListCard>
      )}
      {total > 0 && (
        <TablePagination
          currentPage={page}
          maxPage={totalPages}
          itemsPerPage={limit}
          leftText={`Ressources : ${total}`}
          onSetCurrentPage={setPage}
          onSetItemsPerPage={(value) => {
            storeItemsPerPage("admin-resources", value);
            setLimit(value);
            setPage(1);
          }}
          onSetPreviousPage={() =>
            setPage((current) => Math.max(1, current - 1))
          }
          onSetNextPage={() =>
            setPage((current) => Math.min(totalPages, current + 1))
          }
        />
      )}
      {resourceToDelete && (
        <Modal
          title="Supprimer une ressource supplémentaire"
          leftLabel="Annuler"
          rightLabel="Supprimer"
          isSubmitting={deleting}
          onLeftClick={() => setResourceToDelete(null)}
          onRightClick={handleDeleteResource}
        >
          La ressource « {resourceToDelete.title} » et toutes ses activités
          seront supprimées définitivement.
        </Modal>
      )}
    </PageWrapper>
  );
}
