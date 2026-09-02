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
  const canEditParcours =
    ability.can("update", "parcours") && parcours.canManage !== false;
  const isStudent = !canEditParcours;
  const hasDescription = Boolean(parcoursInfos?.description?.trim());
  const hasTags = (parcoursInfos?.tags.length ?? 0) > 0;
  const hasContacts = (parcoursInfos?.contacts.length ?? 0) > 0;
  const hasBadges = [
    ...(parcoursInfos?.skills ?? []),
    ...(parcoursInfos?.bonusSkills ?? []),
  ].some((skill) => Boolean(skill.badge));
  const hasSupplementaryContent =
    hasDescription || hasTags || hasContacts || hasBadges;

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
              title={parcoursInfos?.title ?? ""}
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

          <div className="mt-4 flex flex-col gap-y-4">
            <QuickStatistiques studentCount={studentCount} />
            {isStudent && modules?.length > 0 ? (
              <ProgressModulesStats modules={modules} />
            ) : null}
            <PermissionGuard object="cursus" action="read">
              <Contenu modules={modules} />
            </PermissionGuard>
            <div className="grid items-start gap-4 lg:grid-cols-3">
              <div
                className={hasSupplementaryContent ? "" : "lg:col-span-3"}
              >
                <Informations />
              </div>
              {hasSupplementaryContent ? (
                <div className="flex flex-wrap content-start gap-4 lg:col-span-2 [&>*]:min-w-0 [&>*]:basis-80 [&>*]:grow">
                  {hasDescription ? <Description /> : null}
                  {hasTags ? <Tags /> : null}
                  {hasContacts ? <Contacts /> : null}
                  {hasBadges ? <Awards /> : null}
                </div>
              ) : null}
            </div>
            <div className="grid md:grid-cols-2 gap-4">
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
