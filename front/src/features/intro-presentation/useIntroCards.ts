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

const TEACHER_RANK = 2;
const STUDENT_RANK = 3;
const STALE_TIME = 5 * 60 * 1000;

type Pathway = {
  formationTitles: string[];
  parcoursTitles: string[];
  parcoursId: number;
};

const unique = (titles: string[]) => [...new Set(titles)];

/**
 * Cartes de la présentation.
 *
 * Seuls les formateurs et les apprenants voient un de leurs parcours ; les
 * autres rôles et le mode démonstration (compte partagé) n'ont que des exemples.
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
  const isTeacher = rank === TEACHER_RANK;
  const isStudent = rank === STUDENT_RANK;
  const canUseOwnContent = enabled && !demoMode && (isTeacher || isStudent);

  const instance = useQuery({
    queryKey: ["instance-settings"],
    queryFn: profileApi.queries.getInstanceSettings,
    enabled,
    staleTime: STALE_TIME,
  });

  const teacherParcours = useQuery({
    queryKey: ["root-parcours"],
    queryFn: dashboardAdminApi.queries.getRootParcours,
    enabled: canUseOwnContent && isTeacher,
    staleTime: STALE_TIME,
  });
  const studentParcours = useQuery({
    queryKey: [...introPresentationKeys.all, "student-parcours"],
    queryFn: dashboardStudentApi.queries.getParcoursAsStudent,
    enabled: canUseOwnContent && isStudent,
    staleTime: STALE_TIME,
  });

  let pathway: Pathway | undefined;
  if (isTeacher) {
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
      };
    }
  }

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

  const source: IntroSource = {
    organisationName: instance.data?.name,
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
    modules,
    moduleDetail,
    lesson,
  ].some((query) => query.isLoading);

  return { cards: buildIntroCards(source), isLoading };
}
