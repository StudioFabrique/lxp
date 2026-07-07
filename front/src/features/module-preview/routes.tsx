import { lazy } from "react";
import { RouteObject } from "react-router";
import { withSuspense } from "../../utils/router-helpers";
import { ChatbotProvider } from "../../../src.legacy/store/chatbotContext";

const ModulePreview = lazy(() => import("./views/ModulePreview"));

const wrapModulePreview = (el: React.ReactNode) => (
  <ChatbotProvider>{el}</ChatbotProvider>
);

export const adminModulePreviewRoutes: RouteObject[] = [
  {
    path: "parcours/module/:moduleId",
    element: wrapModulePreview(withSuspense(ModulePreview)),
  },
];

export const studentModulePreviewRoutes: RouteObject[] = [
  {
    path: "parcours/module/:moduleId",
    element: wrapModulePreview(withSuspense(ModulePreview)),
  },
];
