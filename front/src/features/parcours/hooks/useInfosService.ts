import { useCallback, useState } from "react";
import useHttp from "../../../../src/hooks/useHttp";
import toast from "react-hot-toast";
import Contact from "../../../../src/utils/interfaces/contact";
import { useParcoursDispatch } from "../store/ParcoursContext";
import User from "../../../../src/utils/interfaces/user";

const useInfosService = () => {
  const [loadingContacts, setLoadingContacts] = useState<boolean>(false);
  const [loadingTags, setLoadingTags] = useState<boolean>(false);
  const { sendRequest } = useHttp();
  const dispatch = useParcoursDispatch();

  /**
   * met à jour la liste des tags associés au parcours dans la bdd
   */
  const updateParcoursTags = useCallback(
    (parcoursId: number, tagsIds: number[]) => {
      const processData = (data: { success: boolean; message: string }) => {
        if (data.success) {
          toast.success(data.message);
        }
        setLoadingTags(false);
      };
      setLoadingTags(true);
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
        setLoadingContacts(false);
      };
      setLoadingContacts(true);
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

  const getContacts = useCallback(() => {
    const applyData = (data: Array<User>) => {
      dispatch({ type: "INIT_CONTACTS", payload: data });
    };
    sendRequest(
      {
        path: "/user/contacts",
      },
      applyData
    );
  }, [dispatch, sendRequest]);

  return {
    loadingContacts,
    loadingTags,
    getContacts,
    updateParcoursContacts,
    updateParcoursTags,
  };
};

export default useInfosService;
