/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";
import Module from "../../../../src/utils/interfaces/module";
import ModuleHomeList from "../components/list/module-home";
import ModalSuppression from "../components/list/modal-suppression";
import toast from "react-hot-toast";
import Loader from "../../../components/loaders/Loader";
import apiClient from "../../../../src/lib/axios";

const ModuleHome = () => {
  const [modules, setModules] = useState<Module[] | null>(null);
  const [moduleToDelete, setModuleToDelete] = useState<any>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // retourne la liste de tous les modules
  const getModules = useCallback(() => {
    setIsLoading(true);
    apiClient
      .get("/modules")
      .then((res) => {
        const data = res.data;
        console.log({ data });
        const updatedModules = data.response.map((item: any) => ({
          ...item,
          formation: item.formation,
        }));
        setModules(updatedModules);
      })
      .catch((err) => {
        setError(err?.response?.data?.message ?? "Erreur inconnue");
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleDeleteModule = (module: any) => {
    setModuleToDelete(module);
  };

  /**
   * ferme la modal de confirmation de suppression du module
   */
  const handleCloseModal = () => {
    setModuleToDelete(null);
  };

  const handleConfirmDelete = useCallback(() => {
    if (!moduleToDelete) return;
    apiClient
      .delete(`/modules/${moduleToDelete.id}`)
      .then((res) => {
        const data = res.data as { message: string };
        toast.success(data.message);
        handleCloseModal();
        modules?.filter((item) => item.id !== moduleToDelete.id);
        setModuleToDelete(null);
        getModules();
      })
      .catch((err) => {
        setError(err?.response?.data?.message ?? "Erreur inconnue");
      });
  }, [getModules, moduleToDelete, modules]);

  useEffect(() => {
    getModules();
  }, [getModules]);

  // affiche la modal de confirmation de suppression du module
  useEffect(() => {
    if (moduleToDelete) {
      (document.getElementById("my_modal_3") as HTMLFormElement).showModal();
    }
  }, [moduleToDelete]);

  const message =
    "Confirmez la suppression définitive du module et de son contenu.";
  const rightLabel = "Confirmer";

  // gère les erreurs HTTP
  useEffect(() => {
    if (error.length > 0) {
      toast.error(error);
      setModuleToDelete(null);
    }
  }, [error]);

  return (
    <main className="flex flex-col items-center gap-y-8 w-full">
      <section className="w-full flex justify-center">
        {isLoading ? (
          <div className="flex items-center">
            <Loader />
          </div>
        ) : (
          <div className="w-full">
            {modules ? (
              <ModuleHomeList
                modulesList={modules}
                onDeleteModule={handleDeleteModule}
              />
            ) : null}
          </div>
        )}
      </section>
      <section>
        {moduleToDelete ? (
          <ModalSuppression
            moduleTitle={moduleToDelete.title}
            message={message}
            rightLabel={rightLabel}
            onCloseModal={handleCloseModal}
            onConfirm={handleConfirmDelete}
          />
        ) : null}
      </section>
    </main>
  );
};

export default ModuleHome;
