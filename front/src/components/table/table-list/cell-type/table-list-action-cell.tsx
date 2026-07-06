import { Fragment, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import TableListAction from "../interfaces/table-list-action";
import TableListSwitchInput from "../table-list-switch-input";
import TableActionsModal from "../../table-buttons/table-actions-modal";
import PermissionGuard from "../../../guards/PermissionGuard";
import apiClient from "../../../../lib/axios";

type TableListActionCellProps = TableListAction & { id: string };

const TableListActionCell = (props: TableListActionCellProps) => {
  const [showModal, setShowModal] = useState<boolean>(false);

  // Construction dynamique de l'URL
  const path = props.request
    ? props.request.path.replace("[:id]", props.id ?? "")
    : null;

  // Création d'une mutation générique avec TanStack Query
  const dynamicMutation = useMutation({
    mutationFn: async ({
      url,
      method,
      data,
    }: {
      url: string;
      method: string;
      data?: any;
    }) => {
      const response = await apiClient({ url, method, data });
      return response.data;
    },
    onSuccess: (data) => {
      if (data?.message) toast.success(data.message);

      // On rafraîchit le tableau après le succès
      if (props.onSuccessfulSubmit) {
        props.onSuccessfulSubmit();
      }

      setShowModal(false);
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Une erreur est survenue lors de l'action.",
      );
    },
  });

  const handleRequest = async (value?: string | boolean) => {
    if (path && props.request?.method) {
      // Déclenchement de la mutation
      dynamicMutation.mutate({
        url: path,
        method: props.request.method,
        data: value !== undefined ? { value } : undefined,
      });
    }
  };

  const handleConfirmAction = () => {
    handleRequest(true);
  };

  const handleClick = () => {
    if (props.request) {
      handleRequest();
    } else if (props.onSuccessfulSubmit) {
      props.onSuccessfulSubmit();
    }
  };

  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.checked;
    handleRequest(value);
  };

  const handleClickOpenModal = () => setShowModal(true);
  const handleClickCloseModal = () => setShowModal(false);

  const cell = (
    <td className="px-2 w-0 gap-x-2">
      <TableActionsModal
        {...props.modal}
        isOpen={showModal}
        onCancel={handleClickCloseModal}
      >
        <button
          className={`btn btn-error btn-md ${dynamicMutation.isPending ? "loading" : ""}`}
          onClick={handleConfirmAction}
          disabled={dynamicMutation.isPending}
        >
          Confirmer
        </button>
      </TableActionsModal>

      <div className="flex justify-center">
        <div className="tooltip flex" data-tip={props.tooltip}>
          <TableListSwitchInput
            {...props}
            linkUrl={path}
            onClick={props.modal ? handleClickOpenModal : handleClick}
            onToggle={handleToggle}
            isLoading={dynamicMutation.isPending}
          />
        </div>
      </div>
    </td>
  );

  return props.rbacObject && props.rbacAction ? (
    <PermissionGuard object={props.rbacObject} action={props.rbacAction}>
      {cell}
    </PermissionGuard>
  ) : (
    <Fragment>{cell}</Fragment>
  );
};

export default TableListActionCell;
