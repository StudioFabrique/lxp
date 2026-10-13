import { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { AuthContext } from "../../store/AuthProvider";
import { useDemoMode } from "../../store/DemoContext";
import { dashboardAdminApi } from "../dashboard-admin/api/dashboard-admin.api";
import { dashboardStudentApi } from "../dashboard-student/api/dashboard-student.api";
import { profileApi } from "../profile/api/profile.api";
import {
  buildIntroCards,
  type IntroCard,
  type IntroSource,
  type IntroSelection,
} from "./intro-content";
import {
  buildExampleIntroCards,
  INTRO_EXAMPLE_FORMATIONS,
  type IntroFormationOption,
} from "./intro-example-formations";
import { INTRO_LEVELS } from "./intro-levels";
import { selectIntroChild, selectedIntroEntity } from "./intro-selection";
import {
  introPresentationApi,
  introPresentationKeys,
} from "./intro-presentation.api";

/** Rang le moins élevé de l'équipe (root 0, administrateur 1, pédagogique 2). */
const TEAM_MAX_RANK = 2;
const STUDENT_RANK = 3;
const STALE_TIME = 5 * 60 * 1000;

type Named = { name: string };
type Person = { firstname?: string; lastname?: string };

const names = (items?: readonly Named[]) => items?.map((item) => item.name);
const descriptions = (items?: readonly { description: string }[]) =>
  items?.map((item) => item.description);
const people = (items?: readonly Person[]) =>
  items?.map((item) => [item.firstname, item.lastname].filter(Boolean).join(" "));

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
  onSelectChild: (parentIndex: number, rowIndex: number) => void;
  formationOptions: IntroFormationOption[];
  selectedFormationId: string;
  onSelectFormation: (id: string) => void;
} {
  const [hasInteracted, setHasInteracted] = useState(false);
  const [exampleId, setExampleId] = useState<string | null>(null);
  const [selection, setSelection] = useState<IntroSelection>({});
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

  const teamFormations = (canUseOwnContent && isTeam ? teacherParcours.data ?? [] : []).filter((formation) =>
    formation.canManage !== false && (
      formation.parcours.length === 0 || formation.parcours.some((parcours) => parcours.canManage !== false)
    ),
  );
  const studentPaths = canUseOwnContent && isStudent ? studentParcours.data ?? [] : [];
  const formations: { id?: number; title: string; level: string }[] = isTeam
    ? teamFormations
    : studentPaths.flatMap((path) => path.formation ? [path.formation] : [])
        .filter((formation, index, all) => all.findIndex((other) =>
          formation.id !== undefined ? other.id === formation.id : other.title === formation.title,
        ) === index);
  const formation = selectedIntroEntity(formations, selection.formation);
  const parcours: { id: number; title: string }[] = isTeam
    ? teamFormations.find((item) => item.id === formation?.id)?.parcours
        .filter((item) => item.canManage !== false) ?? []
    : studentPaths.filter((item) => formation && (
        formation.id !== undefined
          ? item.formation?.id === formation.id
          : item.formation?.title === formation.title
      ));
  const selectedParcours = formation
    ? selectedIntroEntity(parcours, selection.parcours)
    : undefined;
  const parcoursId = selectedParcours?.id;

  const parcoursDetail = useQuery({
    queryKey: introPresentationKeys.parcours(parcoursId ?? 0),
    queryFn: () => introPresentationApi.getParcours(parcoursId!),
    enabled: !exampleId && parcoursId !== undefined,
    staleTime: STALE_TIME,
    retry: false,
  });

  const modules = useQuery({
    queryKey: introPresentationKeys.modules(parcoursId ?? 0),
    queryFn: () => introPresentationApi.getModules(parcoursId!),
    enabled: !exampleId && parcoursId !== undefined,
    staleTime: STALE_TIME,
  });
  const selectedModule = selectedIntroEntity(modules.data ?? [], selection.module);
  const moduleId = selectedModule?.id;

  const moduleDetail = useQuery({
    queryKey: introPresentationKeys.moduleDetail(moduleId ?? 0),
    queryFn: () => introPresentationApi.getModuleDetail(moduleId!),
    enabled: !exampleId && moduleId !== undefined,
    staleTime: STALE_TIME,
  });
  const courses = moduleDetail.data?.data.courses ?? [];
  const selectedCourse = selectedIntroEntity(courses, selection.cours);
  const lessons = selectedCourse?.lessons ?? [];
  const selectedLesson = selectedIntroEntity(lessons, selection.lecon);
  const lessonId = selectedLesson?.id;

  const lesson = useQuery({
    queryKey: introPresentationKeys.lesson(lessonId ?? 0),
    queryFn: () => introPresentationApi.getLesson(lessonId!),
    enabled: !exampleId && lessonId !== undefined,
    staleTime: STALE_TIME,
  });

  const moduleInfo = moduleDetail.data?.data;
  const source: IntroSource = {
    organisationName: instance.data?.name,
    includeExamples: false,
    selection,
    entities: {
      formation: formations,
      parcours: formation ? parcours : [],
      module: modules.data ?? [],
      cours: courses,
      lecon: lessons,
    },
    details: {
      "formation.niveau": formation?.level ? [formation.level] : undefined,
      "parcours.groupes": names(parcoursDetail.data?.groups),
      "parcours.tags": names(parcoursDetail.data?.tags),
      "parcours.objectifs": descriptions(parcoursDetail.data?.objectives),
      "parcours.competences": descriptions(parcoursDetail.data?.skills),
      "parcours.contacts": people(parcoursDetail.data?.contacts),
      "module.duree": moduleInfo?.duration ? [`${moduleInfo.duration} heures`] : undefined,
      "module.tags": names(moduleInfo?.tags),
      "module.competences": descriptions(moduleInfo?.bonusSkills),
      "module.contacts": people(moduleInfo?.contacts),
      "cours.tags": names(selectedCourse?.tags),
      "cours.objectifs": descriptions(selectedCourse?.objectives),
      "lecon.tag": lesson.data?.tag ? [lesson.data.tag.name] : undefined,
      "lecon.modalite": lesson.data?.modalite ? [lesson.data.modalite] : undefined,
    },
    formationTitles: formations.map((item) => item.title),
    parcoursTitles: formation ? parcours.map((item) => item.title) : [],
    moduleTitles: modules.data?.map((item) => item.title),
    courseTitles: courses.map((item) => item.title),
    lessonTitles: lessons.map((item) => item.title),
    activities: lesson.data?.activities,
  };

  // Une sélection ne doit pas remonter l’écran d’attente et réinitialiser la scène.
  const isLoading = !hasInteracted && [
    instance,
    teacherParcours,
    studentParcours,
    parcoursDetail,
    modules,
    moduleDetail,
    lesson,
  ].some((query) => query.isLoading);

  const currentFormation = formations[0];
  const formationOptions: IntroFormationOption[] = currentFormation
    ? [{ id: "current", title: currentFormation.title, isCurrent: true }, ...INTRO_EXAMPLE_FORMATIONS.slice(0, 2)]
    : [...INTRO_EXAMPLE_FORMATIONS];
  const selectedFormationId = exampleId ?? (currentFormation ? "current" : INTRO_EXAMPLE_FORMATIONS[0].id);
  const cards = selectedFormationId === "current"
    ? buildIntroCards(source)
    : buildExampleIntroCards(selectedFormationId, selection, instance.data?.name);
  const onSelectFormation = (id: string): void => {
    if (!formationOptions.some((option) => option.id === id)) return;
    setHasInteracted(true);
    setExampleId(id === "current" ? null : id);
    setSelection({});
  };
  const onSelectChild = (parentIndex: number, rowIndex: number): void => {
    const childLevel = INTRO_LEVELS[parentIndex + 1];
    const item = cards[parentIndex]?.rows[rowIndex];
    if (!childLevel || !item) return;
    setHasInteracted(true);
    setSelection((previous) => selectIntroChild(previous, childLevel.id, item));
  };

  return { cards, isLoading, onSelectChild, formationOptions, selectedFormationId, onSelectFormation };
}
