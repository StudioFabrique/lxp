import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";

import { AuthContext } from "../../store/AuthProvider";
import { useDemoMode } from "../../store/DemoContext";
import { dashboardAdminApi } from "../dashboard-admin/api/dashboard-admin.api";
import { dashboardStudentApi } from "../dashboard-student/api/dashboard-student.api";
import { profileApi } from "../profile/api/profile.api";
import { buildIntroCards, type IntroCard, type IntroSource } from "./intro-content";
import {
  introPresentationApi,
  introPresentationKeys,
} from "./intro-presentation.api";

/** Rang le moins élevé de l'équipe (root 0, administrateur 1, pédagogique 2). */
const TEAM_MAX_RANK = 2;
const STUDENT_RANK = 3;
const STALE_TIME = 5 * 60 * 1000;

type Pathway = {
  formationTitles: string[];
  parcoursTitles: string[];
  parcoursId: number;
  /** Niveau de qualification de la formation suivie. */
  formationLevel?: string;
};

type Named = { name: string };
type Person = { firstname?: string; lastname?: string };

const names = (items?: readonly Named[]) => items?.map((item) => item.name);
const descriptions = (items?: readonly { description: string }[]) =>
  items?.map((item) => item.description);
const people = (items?: readonly Person[]) =>
  items?.map((item) => [item.firstname, item.lastname].filter(Boolean).join(" "));

const unique = (titles: string[]) => [...new Set(titles)];

/**
 * Cartes de la présentation.
 *
 * L'équipe (root, administrateur, pédagogique) et les apprenants voient un de leurs
 * parcours ; le mode démonstration (compte partagé) n'a que des exemples.
 * Les lectures s'enchaînent du parcours jusqu'à une leçon et chacune peut
 * échouer sans bloquer : le niveau concerné devient alors un exemple.
 */
export function useIntroCards(enabled: boolean): {
  cards: IntroCard[];
  isLoading: boolean;
} {
  const { user } = useContext(AuthContext);
  const { demoMode } = useDemoMode();
  const rank = user?.roles[0]?.rank;
  const isTeam = rank !== undefined && rank <= TEAM_MAX_RANK;
  const isStudent = rank === STUDENT_RANK;
  const canUseOwnContent = enabled && !demoMode && (isTeam || isStudent);

  const instance = useQuery({
    queryKey: ["instance-settings"],
    queryFn: profileApi.queries.getInstanceSettings,
    enabled,
    staleTime: STALE_TIME,
  });

  const teacherParcours = useQuery({
    queryKey: ["root-parcours"],
    queryFn: dashboardAdminApi.queries.getRootParcours,
    enabled: canUseOwnContent && isTeam,
    staleTime: STALE_TIME,
  });
  const studentParcours = useQuery({
    queryKey: [...introPresentationKeys.all, "student-parcours"],
    queryFn: dashboardStudentApi.queries.getParcoursAsStudent,
    enabled: canUseOwnContent && isStudent,
    staleTime: STALE_TIME,
  });

  let pathway: Pathway | undefined;
  if (isTeam) {
    const formations = (teacherParcours.data ?? []).filter((formation) =>
      formation.parcours.some((parcours) => parcours.canManage !== false),
    );
    const formation = formations[0];
    const parcours = formation?.parcours.filter(
      (item) => item.canManage !== false,
    );
    if (formation && parcours?.length) {
      pathway = {
        formationTitles: unique(formations.map((item) => item.title)),
        parcoursTitles: unique(parcours.map((item) => item.title)),
        parcoursId: parcours[0].id,
        formationLevel: formation.level,
      };
    }
  } else if (isStudent) {
    const all = studentParcours.data ?? [];
    const first = all[0];
    if (first) {
      const sameFormation = all.filter(
        (item) => item.formation?.title === first.formation?.title,
      );
      pathway = {
        formationTitles: unique(
          all.flatMap((item) => (item.formation?.title ? [item.formation.title] : [])),
        ),
        parcoursTitles: unique(sameFormation.map((item) => item.title)),
        parcoursId: first.id,
        formationLevel: first.formation?.level,
      };
    }
  }

  const parcoursDetail = useQuery({
    queryKey: introPresentationKeys.parcours(pathway?.parcoursId ?? 0),
    queryFn: () => introPresentationApi.getParcours(pathway!.parcoursId),
    enabled: Boolean(pathway),
    staleTime: STALE_TIME,
    retry: false,
  });

  const modules = useQuery({
    queryKey: introPresentationKeys.modules(pathway?.parcoursId ?? 0),
    queryFn: () => introPresentationApi.getModules(pathway!.parcoursId),
    enabled: Boolean(pathway),
    staleTime: STALE_TIME,
  });
  const firstModuleId = modules.data?.[0]?.id;

  const moduleDetail = useQuery({
    queryKey: introPresentationKeys.moduleDetail(firstModuleId ?? 0),
    queryFn: () => introPresentationApi.getModuleDetail(firstModuleId!),
    enabled: firstModuleId !== undefined,
    staleTime: STALE_TIME,
  });
  const courses = moduleDetail.data?.data.courses ?? [];
  const firstLessonId = courses[0]?.lessons[0]?.id;

  const lesson = useQuery({
    queryKey: introPresentationKeys.lesson(firstLessonId ?? 0),
    queryFn: () => introPresentationApi.getLesson(firstLessonId!),
    enabled: firstLessonId !== undefined,
    staleTime: STALE_TIME,
  });

  const firstCourse = courses[0];
  const moduleInfo = moduleDetail.data?.data;
  const source: IntroSource = {
    organisationName: instance.data?.name,
    details: {
      "formation.niveau": pathway?.formationLevel ? [pathway.formationLevel] : undefined,
      "parcours.groupes": names(parcoursDetail.data?.groups),
      "parcours.tags": names(parcoursDetail.data?.tags),
      "parcours.objectifs": descriptions(parcoursDetail.data?.objectives),
      "parcours.competences": descriptions(parcoursDetail.data?.skills),
      "parcours.contacts": people(parcoursDetail.data?.contacts),
      "module.duree": moduleInfo?.duration ? [`${moduleInfo.duration} heures`] : undefined,
      "module.tags": names(moduleInfo?.tags),
      "module.competences": descriptions(moduleInfo?.bonusSkills),
      "module.contacts": people(moduleInfo?.contacts),
      "cours.tags": names(firstCourse?.tags),
      "cours.objectifs": descriptions(firstCourse?.objectives),
      "lecon.tag": lesson.data?.tag ? [lesson.data.tag.name] : undefined,
      "lecon.modalite": lesson.data?.modalite ? [lesson.data.modalite] : undefined,
    },
    ...(pathway && {
      formationTitles: pathway.formationTitles,
      parcoursTitles: pathway.parcoursTitles,
      moduleTitles: modules.data?.map((item) => item.title),
      courseTitles: courses.map((course) => course.title),
      lessonTitles: courses[0]?.lessons.map((item) => item.title),
      activities: lesson.data?.activities,
    }),
  };

  const isLoading = [
    instance,
    teacherParcours,
    studentParcours,
    parcoursDetail,
    modules,
    moduleDetail,
    lesson,
  ].some((query) => query.isLoading);

  return { cards: buildIntroCards(source), isLoading };
}
