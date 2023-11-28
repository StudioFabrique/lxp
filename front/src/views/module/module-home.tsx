/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";
import Loader from "../../components/UI/loader";
import Module from "../../utils/interfaces/module";
import useHttp from "../../hooks/use-http";
import ModuleHomeList from "../../components/module-home/module-home";
import ModalSuppression from "../../components/module-home/modal-suppression";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { stepsParcours } from "../../config/steps/steps-parcours";
import RightSideDrawer from "../../components/UI/right-side-drawer/right-side-drawer";
import CoursesList from "../../components/module-home/courses-list";

const ModuleHome = () => {
  const [modules, setModules] = useState<Module[] | null>(null);
  const [moduleToDelete, setModuleToDelete] = useState<any>(null);
  const [currentModule, setCurrentModule] = useState<any>(null);
  const { sendRequest, error, isLoading } = useHttp();
  const nav = useNavigate();

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
    const applyData = (data: { message: string }) => {
      toast.success(data.message);
      handleCloseModal();
      modules?.filter((item) => item.id !== moduleToDelete.id);
      setModuleToDelete(null);
    };
    sendRequest(
      {
        path: `/modules/formation/${moduleToDelete.id}`,
        method: "delete",
      },
      applyData
    );
  }, [sendRequest, moduleToDelete, modules]);

  const handleGotoModule = useCallback(() => {
    if (moduleToDelete && moduleToDelete.parcours) {
      const stepId = stepsParcours.find((item) => item.label === "Modules").id;
      console.log(stepId);

      nav(`/admin/parcours/edit/${moduleToDelete.parcours.id}/${stepId}`);
    }
  }, [moduleToDelete, nav]);

  /**
   * stock le module dont on veut voir la liste des cours en mémoire
   * @param id number
   */
  const handleCoursesList = (id: number) => {
    setCurrentModule(modules?.find((item) => item.id === id));
  };

  const handleCloseDrawer = (id: string) => {
    setCurrentModule(null);
    document.getElementById(id)?.click();
  };

  // si un module est stocké en mémoire ouvre le drawer qui affiche la liste des cours
  useEffect(() => {
    if (currentModule) {
      document.getElementById("courses-list")?.click();
    }
  }, [currentModule]);

  // retourne la liste de tous les modules
  useEffect(() => {
    const applyData = (data: any) => {
      setModules(data.response);
    };
    sendRequest(
      {
        path: "/modules",
      },
      applyData
    );
  }, [sendRequest]);

  // affiche la modal de confirmation de suppression du module
  useEffect(() => {
    if (moduleToDelete) {
      (document.getElementById("my_modal_3") as HTMLFormElement).showModal();
    }
  }, [moduleToDelete]);

  let message: string = "";
  let rightLabel: string = "";

  if (moduleToDelete) {
    if (moduleToDelete.parcours) {
      message =
        "Ce module est associé à un parcours, il ne peut-être supprimer qu'à partir de l'interface d'édion du parcours.";
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
    <main>
      <section className="w-full min-h-screen flex justify-center ">
        {isLoading ? (
          <div className="flex items-center">
            <Loader />
          </div>
        ) : (
          <>
            {modules ? (
              <ModuleHomeList
                modulesList={modules}
                onDeleteModule={handleDeleteModule}
                onCoursesList={handleCoursesList}
              />
            ) : null}
          </>
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
              moduleToDelete.parcours ? handleGotoModule : handleConfirmDelete
            }
          />
        ) : null}
      </section>
      <section>
        <RightSideDrawer
          id="courses-list"
          title="Liste des Cours"
          visible={false}
          onCloseDrawer={handleCloseDrawer}
        >
          {currentModule ? (
            <CoursesList
              coursesList={currentModule.courses}
              moduleId={currentModule.id}
            />
          ) : null}
        </RightSideDrawer>
      </section>
    </main>
  );
};

export default ModuleHome;
