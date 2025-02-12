/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useHttp from "../../hooks/use-http";
import { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Parcours from "../../utils/interfaces/parcours";
import { parcoursAction } from "../../store/redux-toolkit/parcours/parcours";
import { parcoursInformationsAction } from "../../store/redux-toolkit/parcours/parcours-informations";
import { tagsAction } from "../../store/redux-toolkit/tags";
import { parcoursContactsAction } from "../../store/redux-toolkit/parcours/parcours-contacts";
import { parcoursSkillsAction } from "../../store/redux-toolkit/parcours/parcours-skills";
import { parcoursObjectivesAction } from "../../store/redux-toolkit/parcours/parcours-objectives";
import FadeWrapper from "../../components/UI/fade-wrapper/fade-wrapper";
import Loader from "../../components/UI/loader";
import Error404 from "../../components/error404";
import Contenu from "../../components/parcours-view/contenu/contenu";
import Informations from "../../components/parcours-view/informations";
import Description from "../../components/parcours-view/description";
import Tags from "../../components/parcours-view/tags";
import Awards from "../../components/parcours-view/awards";
import Contacts from "../../components/parcours-view/contacts";
import Competences from "../../components/parcours-view/competences";
import Objectifs from "../../components/parcours-view/objectifs";
import QuickStatistiques from "../../components/parcours-view/quick-statistiques/quick-statistiques";
import { parcoursModulesSliceActions } from "../../store/redux-toolkit/parcours/parcours-modules";
import { useSelector } from "react-redux";
import ProgressModulesStats from "../../components/parcours-view/progress-stats";
import HeaderMenu from "../../components/UI/header-menu";
import ImageHeader from "../../components/image-header";
import Can from "../../components/UI/can/can.component";
import Module from "../../utils/interfaces/module";
import { BookMarkedIcon, RocketIcon } from "lucide-react";

let initialState = true;

const ParcoursView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { sendRequest, error } = useHttp();
  const { pathname } = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [image, setImage] = useState<string>();
  const parcours = useSelector((state: any) => state.parcours);
  const parcoursInfos = useSelector(
    (state: any) => state.parcoursInformations.infos,
  );
  const modules = useSelector(
    (state: { parcoursModules: { modules: Module[] } }) =>
      state.parcoursModules.modules,
  );
  const [studentCount, setStudentCount] = useState<number>();

  const currentRoute = pathname.split("/").slice(1) ?? [];

  const handleClickResume = () => {
    const resumeModuleId =
      modules.find((module) =>
        module.courses?.some((course) =>
          course.lessons?.some(
            (lesson) =>
              !lesson.lessonsRead?.length || !lesson.lessonsRead[0]?.finishedAt,
          ),
        ),
      )?.id || modules[0].id;

    navigate(`/${currentRoute[0]}/parcours/module/${resumeModuleId}`);
  };

  /**
   * télécharge les données du parcours depuis la bdd et initialise les différentes propriétés du parcours
   */
  useEffect(() => {
    const processData = (data: Parcours & { studentCount?: number }) => {
      setStudentCount(data.studentCount);
      // mets en mémoire l'id du parcours pour le rendre disponible aux éléments de la vue
      dispatch(parcoursAction.setParcoursId(data.id));
      dispatch(
        parcoursInformationsAction.updateParcoursInfos({
          title: data.title,
          description: data.description,
        }),
      );
      dispatch(
        parcoursInformationsAction.updateParcoursDates({
          startDate: data.startDate,
          endDate: data.endDate,
        }),
      );
      dispatch(parcoursAction.setParcoursFormation(data.formation));

      if (data.image) {
        setImage(`data:image/jpeg;base64,${data.image}`);
      }
      if (data.tags.length > 0) {
        dispatch(
          tagsAction.setCurrentTags(data.tags.map((item: any) => item.tag)),
        );
      } else {
        dispatch(
          tagsAction.setCurrentTags(
            data.formation.tags.map((item: any) => item.tag),
          ),
        );
      }

      if (data.virtualClass) {
        dispatch(parcoursInformationsAction.setVirtualClass(data.virtualClass));
      }

      if (data.contacts.length > 0) {
        dispatch(
          parcoursContactsAction.setCurrentContacts(
            data.contacts.map((item: any) => item.contact),
          ),
        );
      }
      if (data.skills.length > 0) {
        dispatch(
          parcoursSkillsAction.setSkillsList(
            data.skills.map((item: any) => item.skill),
          ),
        );
      }

      if (data.bonusSkills.length > 0) {
        dispatch(parcoursSkillsAction.setSkillsList(data.bonusSkills));
      }

      if (data.objectives.length > 0) {
        dispatch(
          parcoursObjectivesAction.addImportedObjectivesToObjectives(
            data.objectives,
          ),
        );
      }

      if (data.modules.length > 0) {
        dispatch(
          parcoursModulesSliceActions.setModules(
            data.modules.map((module: any) => module.module),
          ),
        );
      }

      setIsLoading(false);
    };
    if (initialState) {
      setIsLoading(true);
      sendRequest(
        {
          path: `/parcours/parcours-by-id/${id}`,
        },
        processData,
      );
      initialState = false;
    }
  }, [id, dispatch, sendRequest]);

  /**
   * réinitialise les données du parcours lorsque l'utilisateur quitte la page
   */
  useEffect(() => {
    return () => {
      initialState = true;
      dispatch(parcoursAction.reset());
      dispatch(parcoursInformationsAction.reset());
      dispatch(tagsAction.reset());
      dispatch(parcoursContactsAction.reset());
      dispatch(parcoursSkillsAction.reset());
      dispatch(parcoursObjectivesAction.reset());
    };
  }, [dispatch]);

  return (
    <div className="px-8 p-4">
      {isLoading ? (
        <Loader />
      ) : error.length === 0 ? (
        <FadeWrapper>
          <div className="w-full">
            <ImageHeader
              imageUrl={image ?? "/images/parcours-default.webp"}
              title={parcoursInfos.title}
              titleIcon={<RocketIcon className="stroke-white" />}
              subTitle={parcours.formation?.title}
              subTitleIcon={<BookMarkedIcon className="stroke-white" />}
              children={[
                <Fragment key="fragment" />,
                <Can key="header" object="cursus" action="read">
                  <HeaderMenu key="header" onClickResume={handleClickResume} />
                </Can>,
              ]}
              hidePublished
            />
          </div>

          <div className="mt-5 flex flex-col gap-y-5">
            <QuickStatistiques studentCount={studentCount} />
            <Can action="component" object="progression">
              <ProgressModulesStats modules={modules} />
            </Can>
            <Can object="cursus" action="read">
              <Contenu modules={modules} />
            </Can>
            <div className="grid lg:grid-cols-3 gap-x-5 gap-y-5">
              <div className="grid grid-rows-2 gap-y-5">
                <Informations />
                <Description />
              </div>
              <div className="grid grid-rows-2 gap-y-5">
                <Tags />
                <Awards />
              </div>
              <div>
                <Contacts />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-5">
              <Competences />
              <Objectifs />
            </div>
          </div>
        </FadeWrapper>
      ) : (
        <Error404 />
      )}
    </div>
  );
};

export default ParcoursView;
