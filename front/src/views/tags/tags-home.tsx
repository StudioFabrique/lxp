import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import Can from "../../components/UI/can/can.component";
import Header from "../../components/UI/header";
import {
  actionsConfig,
  tableListConfig,
  searchBarConfig,
} from "./tags-home-table-config";
import Table from "../../components/table/table";
import TablePagination from "../../components/table/table-pagination/table-pagination";
import useTablePaginatedData from "../../components/table/table-pagination/hooks/use-table-paginated-data";
import toast from "react-hot-toast";
import { useEffect, useRef, useState } from "react";
import useTableCheckbox from "../../components/table/table-list/hooks/use-table-checkbox";
import useTagActions from "./hooks/use-tags-actions";
import TableActionsButtons from "../../components/table/table-buttons/table-actions-buttons";
import Tag from "../../utils/interfaces/tag";
import { PlusCircle } from "lucide-react";
import Modal from "../../components/UI/modal/modal";
import TagsHomeAdding from "./tags-home-adding";

/**
 * Composant TagsHome
 *
 * Affiche une liste de tags avec des fonctionnalités pour créer,
 * modifier et supprimer des tags. Utilise un tableau paginé pour
 * présenter les données, avec une barre de recherche intégrée.
 * Gère les notifications toast pour informer l'utilisateur des actions.
 *
 * @component
 */
const TagsHome = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  const modalButtonRef = useRef<HTMLButtonElement | null>(null);

  // custom hook gestion pagination
  const {
    data,
    searchValue,
    isLoading,
    totalItems,
    sortProperty,
    isAscDirection,
    onRefreshData,
    onSubmitSearchValue,
    onSortProperty,
    ...pagination
  } = useTablePaginatedData<Tag>("/tags/student", {
    apiSearchEndpoint: "/tags/search/student",
    searchProperty: "name",
  });

  // custom hook gestion checkbox
  const {
    idsList,
    onRetreiveItemsValuesByPropertyFromIdList,
    ...checkboxConfig
  } = useTableCheckbox<Tag>(data, "id");

  // custom hook gestion actions groupées
  const { isSubmitting, onCreateTags, onDeleteSelectedTags } = useTagActions(
    idsList,
    onRefreshData,
  );

  const handleDismissModal = () => {
    navigate(".", { replace: true });
  };

  const handleClickCreateTags = async () => {
    modalButtonRef.current?.click();
  };

  // Si un message du state est présent, alors il s'affiche dans un toaster
  useEffect(() => {
    if (state && state.toastFrom) toast.success(state.toastFrom);
  }, [state]);

  useEffect(() => {
    const openModal = searchParams.get("openModal");

    if (openModal) {
      setModalOpen(true);
    } else {
      setModalOpen(false);
    }
  }, [searchParams]);

  return (
    <>
      {isModalOpen ? (
        <Modal
          title="Création des tags"
          leftLabel="Annuler"
          onLeftClick={handleDismissModal}
          rightLabel="Valider"
          onRightClick={handleClickCreateTags}
          isSubmitting={isSubmitting}
        >
          <TagsHomeAdding ref={modalButtonRef} onSubmitAllTags={onCreateTags} />
        </Modal>
      ) : null}
      {/* Header de la liste des tags */}
      <Header
        title="Liste des tags"
        description="Créer, modifier et supprimer des tags"
      >
        <Can object="tag" action="write">
          <Link className="btn btn-primary text-base-100" to="?openModal=true">
            <PlusCircle />
            Créer un nouveau tag
          </Link>
        </Can>
      </Header>

      {/*
       * Tableau generique utilisé pour la liste des tags,
       * utilisation du pattern composition
       */}
      <Table
        searchBarConfig={searchBarConfig(onSubmitSearchValue)}
        tableListConfig={tableListConfig(
          data,
          isLoading,
          Boolean(searchValue),
          actionsConfig(onRefreshData),
        )}
        checkboxConfig={checkboxConfig}
        sortConfig={{ sortProperty, isAscDirection, onSortProperty }}
      >
        {/* Composants children en haut et en bas du tableau */}
        {[
          // haut du tableau, à côté de la barre de recherche
          <TableActionsButtons
            key={0}
            isLoading={isLoading}
            isDisabled={!(idsList.length > 0)} // disabled si la liste a une longueur de 0
            onRefreshData={onRefreshData}
            actions={[
              {
                title: "Supprimer les tags selectionnés",
                description: `${idsList.length} ${idsList.length > 1 ? "tags vont être supprimés" : "tag va être supprimé"}`,
                rightButtonTitle: "Supprimer",
                onConfirm: onDeleteSelectedTags,
              },
            ]}
            retreiveItemsProperty="name"
            onRetreiveItemsValuesByPropertyFromIdList={
              onRetreiveItemsValuesByPropertyFromIdList
            }
          />,
          // bas du tableau
          <TablePagination
            key={1}
            leftText={`Nombre de tags : ${totalItems}`}
            {...pagination}
          />,
        ]}
      </Table>
    </>
  );
};

export default TagsHome;
