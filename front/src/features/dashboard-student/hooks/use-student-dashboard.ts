import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../../store/AuthProvider";
import { formatWelcomeTitle } from "../../../utils/helpers/welcome-title";
import { useOnboarding } from "../../onboarding/OnboardingContext";
import { dashboardStudentApi } from "../api/dashboard-student.api";
import {
  learningProfileApi,
  learningProfileKey,
} from "../../learning-profile/learning-profile.api";

const defaultTitle = "Bonjour, {firstname} !";
const defaultMessage =
  "Bienvenue dans votre espace, commencez votre apprentissage ou reprenez là où vous vous êtes arrêté";

export function useStudentDashboard() {
  const { user } = useContext(AuthContext);
  const { status: onboardingStatus } = useOnboarding();

  const { data: lastLessons } = useQuery({
    queryKey: ["last-read-lessons"],
    queryFn: dashboardStudentApi.queries.getLastReadLessons,
  });

  const learningContext = useQuery({
    queryKey: learningProfileKey,
    queryFn: learningProfileApi.get,
    refetchOnWindowFocus: true,
  });

  return {
    showOnboardingWelcome:
      onboardingStatus === "pending" &&
      learningContext.data?.hasAvailableContent === true &&
      learningContext.data?.onboardingRequired === false,
    welcomeTitle: formatWelcomeTitle(defaultTitle, user),
    welcomeMessage: defaultMessage,
    lastLesson: lastLessons?.[0],
    remainingLessons: lastLessons?.slice(1) ?? [],
    hasLastLessons: Boolean(lastLessons?.length),
    learningContext,
  };
}
