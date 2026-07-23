/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";
import Module from "../../../../src/utils/interfaces/module";
import ModuleHomeList from "../components/list/module-home";
import ModalSuppression from "../components/list/modal-suppression";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import Loader from "../../../components/loaders/Loader";
import { stepsParcours } from "../../../config/steps/steps-parcours";
import apiClient from "../../../../src/lib/axios";

const ModuleHome = () => {
  const [modules, setModules] = useState<Module[] | null>(null);
  const [moduleToDelete, setModuleToDelete] = useState<any>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const nav = useNavigate();

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
      .delete(`/modules/formation/${moduleToDelete.id}`)
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

  const handleGotoModule = useCallback(() => {
    if (moduleToDelete && moduleToDelete.parcours) {
      const stepId = stepsParcours.find((item) => item.label === "Modules").id;
      console.log(stepId);

      nav(
        `/admin/parcours/edit/${moduleToDelete.parcoursId}?step=${stepId}&moduleId=${moduleToDelete.metadataId}`,
      );
    }
  }, [moduleToDelete, nav]);

  useEffect(() => {
    getModules();
  }, [getModules]);

  // affiche la modal de confirmation de suppression du module
  useEffect(() => {
    if (moduleToDelete) {
      (document.getElementById("my_modal_3") as HTMLFormElement).showModal();
    }
  }, [moduleToDelete]);

  let message: string = "";
  let rightLabel: string = "";

  if (moduleToDelete) {
    if (moduleToDelete.parcoursId) {
      message =
        "Ce module est associé à un parcours, il ne peut-être supprimer qu'à partir de l'interface d'édition du parcours.";
      rightLabel = "Voir le module dans le parcours";
    } else if (moduleToDelete.formation) {
      message = "Confirmez la suppression définitive du module svp";
      rightLabel = "Confirmer";
    }
  } else {
    message = "";
    rightLabel = "";
  }

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
            onConfirm={
              moduleToDelete.parcoursId ? handleGotoModule : handleConfirmDelete
            }
          />
        ) : null}
      </section>
    </main>
  );
};

export default ModuleHome;
