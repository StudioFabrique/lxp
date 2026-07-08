import {
  createBrowserRouter,
  Navigate,
  RouteObject,
  useRouteError,
} from "react-router";

// --- Imports ---
import { authRoutes } from "./features/auth/routes";
import AppWrapper from "./components/wrappers/AppWrapper";
import RouteGuard from "./components/guards/RouteGuard";
import { ROLES_RANKS } from "./utils/helpers/roles-rank";
import Sidebar from "./components/sidebar/Sidebar";
import Loader from "./components/loaders/Loader";
import ConfettiWrapper from "./components/wrappers/ConfettiWrapper";
import FeaturesList from "./features/dashboard/views/FeaturesList";
import Chatbot from "./components/chatbot/chatbot";
import { isAiDisabled } from "../src.legacy/config/ai/ai";
import { ChatbotProvider } from "./store/ChatbotProvider";

// --- Feature Routes Imports ---
import {
  adminParcoursRoutes,
  studentParcoursRoutes,
} from "./features/parcours/routes";
import { adminGroupRoutes } from "./features/group/routes";
import { adminCourseRoutes } from "./features/course/routes";
import { adminLessonRoutes } from "./features/lesson/routes";
import { adminTagsRoutes } from "./features/tags/routes";
import { adminRoleRoutes } from "./features/role/routes";
import { adminUserRoutes } from "./features/user/routes";
import { adminFormationRoutes } from "./features/formation/routes";
import { adminFeedbacksRoutes } from "./features/feedbacks/routes";
import { adminDashboardIARoutes } from "./features/dashboard-ia/routes";
import { adminModuleRoutes } from "./features/module/routes";
import {
  adminModulePreviewRoutes,
  studentModulePreviewRoutes,
} from "./features/module-preview/routes";
import {
  adminResourcesRoutes,
  studentResourcesRoutes,
} from "./features/resources/routes";
import { adminMediathequeRoutes } from "./features/mediatheque/routes";
import { studentCalendarRoutes } from "./features/calendar/routes";
import {
  adminProfileRoutes,
  studentProfileRoutes,
} from "./features/profile/routes";
import {
  adminDashboardRoutes,
  studentDashboardRoutes,
} from "./features/dashboard/routes";

// ==========================================
// LAYOUTS & ERROR HANDLING
// ==========================================

// Composant d'erreur spécifique au routage
const RouterErrorBoundary = () => {
  const error = useRouteError();
  console.error("Erreur de routage capturée :", error);
  return (
    <div>
      Oups, une erreur inattendue est survenue lors du chargement de cette page.
    </div>
  );
};

// Layout Admin isolé
const AdminLayout = () => (
  <ChatbotProvider>
    <AppWrapper sidebar={<Sidebar />} loader={<Loader />}>
      <RouteGuard allowedRanks={[ROLES_RANKS.SUPER_ADMIN, ROLES_RANKS.ADMIN]} />
    </AppWrapper>
    {!isAiDisabled && <Chatbot />}
  </ChatbotProvider>
);

// Layout Étudiant isolé
const StudentLayout = () => (
  <ChatbotProvider>
    <ConfettiWrapper>
      <AppWrapper sidebar={<Sidebar />} loader={<Loader />}>
        <RouteGuard allowedRanks={[ROLES_RANKS.STUDENT]} />
      </AppWrapper>
    </ConfettiWrapper>
    {!isAiDisabled && <Chatbot />}
  </ChatbotProvider>
);

// ==========================================
// ROUTES DEFINITION
// ==========================================

const adminRoutes: RouteObject[] = [
  {
    path: "/admin",
    element: <AdminLayout />,
    errorElement: <RouterErrorBoundary />,
    children: [
      { index: true, element: <Navigate to="./dashboard" replace /> },
      ...adminDashboardRoutes,
      ...adminParcoursRoutes,
      ...adminModulePreviewRoutes,
      ...adminGroupRoutes,
      ...adminModuleRoutes,
      ...adminCourseRoutes,
      ...adminLessonRoutes,
      ...adminTagsRoutes,
      ...adminRoleRoutes,
      ...adminUserRoutes,
      ...adminFormationRoutes,
      ...adminFeedbacksRoutes,
      ...adminDashboardIARoutes,
      ...adminMediathequeRoutes,
      ...adminResourcesRoutes,
      ...adminProfileRoutes,
      { path: "*", element: <p>La page n'existe pas</p> },
    ],
  },
];

const studentRoutes: RouteObject[] = [
  {
    path: "/student",
    element: <StudentLayout />,
    errorElement: <RouterErrorBoundary />,
    children: [
      { index: true, element: <Navigate to="./dashboard" replace /> },
      ...studentDashboardRoutes,
      ...studentParcoursRoutes,
      ...studentModulePreviewRoutes,
      ...studentResourcesRoutes,
      ...studentCalendarRoutes,
      ...studentProfileRoutes,
      { path: "*", element: <FeaturesList /> },
    ],
  },
];

export const router = createBrowserRouter([
  ...authRoutes,
  ...adminRoutes,
  ...studentRoutes,
  {
    path: "*",
    element: <Navigate replace to="/login" />,
  },
]);
