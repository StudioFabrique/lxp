import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import Loader from "../../../components/loaders/Loader";
import Modal from "../../../components/UI/modal/modal";
import { getApiErrorMessage } from "../../../utils/helpers/api-error-message";
import { courseApi } from "../../course/api/course.api";
import ModuleHomeList from "../components/list/module-home";
import { moduleApi, type ModuleListItem } from "../api/module.api";

type CourseToDelete = ModuleListItem["courses"][number] & {
  moduleTitle: string;
};

const ModuleHome = () => {
  const [moduleToDelete, setModuleToDelete] = useState<ModuleListItem | null>(
    null,
  );
  const [courseToDelete, setCourseToDelete] = useState<CourseToDelete | null>(
    null,
  );
  const queryClient = useQueryClient();
  const { data: modules = [], isLoading } = useQuery(moduleApi.queries.list());

  const deleteModuleMutation = useMutation({
    mutationFn: moduleApi.mutations.remove,
    onSuccess: (data) => {
      toast.success(data.message);
      setModuleToDelete(null);
      void queryClient.invalidateQueries({ queryKey: ["modules"] });
    },
    onError: (error) => {
      toast.error(
        getApiErrorMessage(error, "Le module n'a pas pu être supprimé."),
      );
    },
  });

  const deleteCourseMutation = useMutation({
    mutationFn: courseApi.mutations.deleteCourse,
    onSuccess: (data) => {
      toast.success(data.message);
      setCourseToDelete(null);
      void queryClient.invalidateQueries({ queryKey: ["modules"] });
      void queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
    onError: (error) => {
      toast.error(
        getApiErrorMessage(error, "Le cours n'a pas pu être supprimé."),
      );
    },
  });

  const handleConfirmDelete = () => {
    if (!moduleToDelete) return;
    deleteModuleMutation.mutate(moduleToDelete.id);
  };

  const handleConfirmCourseDelete = () => {
    if (!courseToDelete) return;
    deleteCourseMutation.mutate(courseToDelete.id);
  };

  return (
    <main className="w-full">
      {isLoading ? (
        <div className="flex items-center justify-center">
          <Loader />
        </div>
      ) : (
        <ModuleHomeList
          modulesList={modules}
          onDeleteModule={setModuleToDelete}
          onDeleteCourse={setCourseToDelete}
        />
      )}

      {moduleToDelete ? (
        <Modal
          title={`Supprimer le module « ${moduleToDelete.title} »`}
          leftLabel="Annuler"
          rightLabel="Confirmer"
          isSubmitting={deleteModuleMutation.isPending}
          onLeftClick={() => setModuleToDelete(null)}
          onRightClick={handleConfirmDelete}
        >
          <p className="py-4">
            Le module, ses cours, ses leçons et les ressources associées seront
            définitivement supprimés.
          </p>
        </Modal>
      ) : null}

      {courseToDelete ? (
        <Modal
          title={`Supprimer le cours « ${courseToDelete.title} »`}
          leftLabel="Annuler"
          rightLabel="Confirmer"
          isSubmitting={deleteCourseMutation.isPending}
          onLeftClick={() => setCourseToDelete(null)}
          onRightClick={handleConfirmCourseDelete}
        >
          <p className="py-4">
            Le cours du module « {courseToDelete.moduleTitle} » et ses
            ressources associées seront définitivement supprimés.
          </p>
        </Modal>
      ) : null}
    </main>
  );
};

export default ModuleHome;
