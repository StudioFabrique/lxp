import { Link, useLocation, useNavigate, useParams } from "react-router";
import { Fragment, useContext, useEffect } from "react";
import FadeWrapper from "../../../../src/components/wrappers/FadeWrapper";
import Loader from "../../../../src/components/loaders/Loader";
import Error404 from "../../../components/error404";
import Contenu from "../components/display/contenu/contenu";
import Informations from "../components/display/informations";
import Description from "../components/display/description";
import Tags from "../components/display/tags";
import Awards from "../components/display/awards";
import Contacts from "../components/display/contacts";
import Competences from "../components/display/competences";
import Objectifs from "../components/display/objectifs";
import QuickStatistiques from "../components/display/quick-statistiques/quick-statistiques";
import ProgressModulesStats from "../components/display/progress-stats";
import HeaderMenu from "../../../components/UI/header-menu";
import ImageHeader from "../../../../src/components/image-header/image-header";
import { Bell, Edit, GraduationCap, RocketIcon, Search } from "lucide-react";
import useParcoursView from "../hooks/useParcoursView";
import Header from "../../../../src/components/headers/Header";
import PermissionGuard from "../../../components/guards/PermissionGuard";
import { AbilityContext } from "../../../rbac/AbilityProvider";

const ParcoursView = () => {
  const {
    isLoading,
    error,
    image,
    parcours,
    parcoursInfos,
    modules,
    studentCount,
  } = useParcoursView();

  const navigate = useNavigate();
  const { id } = useParams();
  const { pathname } = useLocation();
  const currentRoute = pathname.split("/").slice(1) ?? [];
  const ability = useContext(AbilityContext);
  const canEditParcours = ability.can("update", "parcours");
  const isStudent =
    ability.can("layout", "student") && !ability.can("layout", "admin");

  const handleClickResume = () => {
    const resumeModuleId =
      modules?.find((module) =>
        module.courses?.some((course) =>
          course.lessons?.some(
            (lesson) =>
              !lesson.lessonsRead || !lesson.lessonsRead[0]?.finishedAt,
          ),
        ),
      )?.id || modules?.[0]?.id;

    navigate(`/${currentRoute[0]}/parcours/module/${resumeModuleId}`);
  };

  useEffect(() => {
    document.getElementById("main-scroll-container")?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  return (
    <div className="w-full flex flex-col gap-6">
      <Header
        title="Aperçu du parcours"
        description="Bienvenue dans votre espace. Commencez votre apprentissage ou
            reprenez là où vous vous êtes arrêté."
      >
        <div className="flex gap-4 w-full">
          {canEditParcours ? (
            <Link
              to={`/admin/parcours/edit/${id}`}
              className="btn btn-outline btn-primary"
            >
              <Edit />
              Modifier le parcours
            </Link>
          ) : (
            <>
              <button className="btn btn-outline btn-primary">
                <Search />
              </button>
              <button className="btn btn-outline btn-primary">
                <Bell />
              </button>
            </>
          )}
        </div>
      </Header>
      {isLoading ? (
        <Loader />
      ) : error.length === 0 ? (
        <FadeWrapper>
          <div className="w-full">
            <ImageHeader
              imageUrl={image ?? "/images/parcours-default.webp"}
              title={parcoursInfos.title}
              titleIcon={<RocketIcon className="stroke-white w-5" />}
              subTitle={parcours.formation?.title}
              subTitleIcon={<GraduationCap className="stroke-white w-5" />}
              children={[
                <Fragment key="fragment" />,
                <PermissionGuard key="header" object="cursus" action="read">
                  <HeaderMenu
                    key="header"
                    onClickResume={handleClickResume}
                    hideResumeCourseButton={!(modules?.length > 0)}
                    isStudent={isStudent}
                  />
                </PermissionGuard>,
              ]}
              hidePublished
            />
          </div>

          <div className="mt-5 flex flex-col gap-y-5">
            <QuickStatistiques studentCount={studentCount} />
            {isStudent && modules?.length > 0 ? (
              <ProgressModulesStats modules={modules} />
            ) : null}
            <PermissionGuard object="cursus" action="read">
              <Contenu modules={modules} />
            </PermissionGuard>
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
