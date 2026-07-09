/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import FadeWrapper from "../../../../src/components/wrappers/FadeWrapper";
import toast from "react-hot-toast";
import Wrapper from "../../../../src/components/wrappers/BoxWrapper";
import Selecter from "../../../components/UI/selecter/selecter.component";
import NewCourseForm from "../components/edit/new-course-form";
import bgImage from "../../../../src/assets/images/new-parcours-default.jpg";
import { useLocation, useNavigate } from "react-router";
import { bgImageGradient } from "../../../utils/helpers/color-helpers";
import { courseApi } from "../api/course.api";

// type de données pour les listes
type Item = {
  id: number;
  title: string;
  reference?: number;
  tooltip: string;
};

const AddCourse = () => {
  const location = useLocation();
  const [parcoursList, setParcoursList] = useState<Item[]>([]);
  const [parcoursId, setParcoursId] = useState<number | null>(
    location.state?.parcoursId
  );
  const [modulesList, setModulesList] = useState<Item[]>([]);
  const [moduleId, setModuleId] = useState<number | null>(
    location.state?.moduleId
  );
  const [isLoading, setIsLoading] = useState(false);
  const nav = useNavigate();

  const { data: parcoursData } = useQuery({
    ...courseApi.queries.parcoursSelect(),
  });

  const { data: modulesData } = useQuery({
    ...courseApi.queries.modulesByParcours(parcoursId!),
    enabled: !!parcoursId,
  });

  useEffect(() => {
    if (parcoursData) {
      setParcoursList(parcoursData);
    }
  }, [parcoursData]);

  useEffect(() => {
    if (modulesData) {
      setModulesList(modulesData);
    }
  }, [modulesData]);

  // Image affichée sur la vue sous forme de background-image
  const classImage: React.CSSProperties = {
    backgroundImage: bgImageGradient(bgImage),
    width: "100%",
    minHeight: "20rem",
    maxHeight: "100%",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    borderRadius: "0.75rem",
  };

  /**
   * définit le parcours sélectionné par l'utilisateur dans le but de
   * récupérer les modules associés à ce parcours
   * @param id number
   */
  const handleParcours = (id: number) => {
    setParcoursId(id);
  };

  /**
   * actualise l'id du module auquel doit être rattaché le cours
   * @param id number
   */
  const handleModuleId = (id: number) => {
    setModuleId(id);
  };

  /**
   * enregistre le cours dans la bdd
   * @param title string
   */
  const handleSubmit = useCallback(
    async (title: string) => {
      if (moduleId) {
        setIsLoading(true);
        try {
          const data = await courseApi.mutations.create({ title, moduleId });
          setIsLoading(false);
          toast.success(data.message);
          nav(`/admin/course/edit/${data.course.id}`, { replace: true });
        } catch (err: any) {
          setIsLoading(false);
          toast.error(err?.response?.data?.message ?? "Erreur inconnue");
        }
      }
    },
    [moduleId, nav]
  );

  /**
   * Submit automatique du cours si les state passées au router
   * sont complets (moduleId, courseId et courseTitle)
   */
  useEffect(() => {
    const retreivedCourseTitle = location.state?.courseTitle as string;
    if (
      retreivedCourseTitle &&
      retreivedCourseTitle.length > 0 &&
      parcoursId &&
      moduleId
    ) {
      handleSubmit(retreivedCourseTitle);
    }
  }, [handleSubmit, location.state?.courseTitle, moduleId, parcoursId]);

  return (
    <FadeWrapper>
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-16 mx-auto my-16">
        <>
          <div>
            <div className="grid grid-rows-2 gap-8">
              <h1 className="text-2xl font-extrabold">Création d'un cours</h1>
              <h3>
                Pour commencer, veuillez saisir les informations nécessaires
                pour créer le cours
              </h3>

              <Wrapper>
                <div className="h-full flex flex-col justify-around gap-y-4">
                  <div className="font-bold">
                    Choisissez un parcours et un module
                  </div>
                  <div className="flex flex-col gap-y-8">
                    <Selecter
                      defaultItem={{ id: parcoursId ?? 0, title: "" }}
                      list={parcoursList}
                      title="Choisissez un parcours"
                      onSelectItem={handleParcours}
                    />
                    <Selecter
                      defaultItem={{ id: moduleId ?? 0, title: "" }}
                      list={modulesList}
                      title="Choisisez un module"
                      onSelectItem={handleModuleId}
                    />
                    <NewCourseForm
                      moduleAndParcours={parcoursId && moduleId ? true : false}
                      label="Titre du cours"
                      isLoading={isLoading}
                      onSubmit={handleSubmit}
                    />
                  </div>
                </div>
              </Wrapper>
            </div>
          </div>
          <div style={classImage} />
        </>
      </div>
    </FadeWrapper>
  );
};

export default AddCourse;
