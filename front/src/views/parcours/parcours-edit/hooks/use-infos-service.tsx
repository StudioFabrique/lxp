import { useCallback } from "react";
import useHttp from "../../../../hooks/use-http";
import toast from "react-hot-toast";
import Contact from "../../../../utils/interfaces/contact";

const useInfosService = () => {
  const { sendRequest } = useHttp();

  /**
   * met à jour la liste des tags associés au parcours dans la bdd
   */
  const updateParcoursTags = useCallback(
    (parcoursId: number, tagsIds: number[]) => {
      const processData = (data: { success: boolean; message: string }) => {
        if (data.success) {
          toast.success(data.message);
        }
      };
      sendRequest(
        {
          path: "/parcours/update-tags",
          method: "put",
          body: { parcoursId, tags: tagsIds },
        },
        processData
      );
    },
    [sendRequest]
  );

  /**
   * met àjour la liste des contacts associés au parcours dans la bdd
   */
  const updateParcoursContacts = useCallback(
    (parcoursId: number, contacts: Contact[]) => {
      const processData = (data: {
        success: boolean;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: any;
        message: string;
      }) => {
        if (data.success) {
          toast.success(data.message);
        }
      };
      sendRequest(
        {
          path: "/parcours/update-contacts",
          method: "put",
          body: { parcoursId, contacts },
        },
        processData
      );
    },
    [sendRequest]
  );

  return { updateParcoursContacts, updateParcoursTags };
};

export default useInfosService;
