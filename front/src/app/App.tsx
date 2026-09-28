import { useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router";

import { queryClient } from "../lib/react-query";
import { router } from "./router";

import { ThemeProvider } from "../store/ThemeProvider";
import { AuthProvider } from "../store/AuthProvider";
import { DemoProvider } from "../store/DemoProvider";
import ErrorBoundary from "../components/wrappers/layouts/ErrorBoundary";
import { Toaster } from "react-hot-toast";
import { AbilityProvider } from "../rbac/AbilityProvider";
import { VisualPreferencesProvider } from "../store/VisualPreferences";

function App() {
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      document.getElementById("boot-skeleton")?.remove();
      document.getElementById("boot-auth-skeleton")?.remove();
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <>
      <Toaster />
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <VisualPreferencesProvider>
            <DemoProvider>
              <AuthProvider>
                <AbilityProvider>
                  <ErrorBoundary>
                    <RouterProvider router={router} />
                  </ErrorBoundary>
                </AbilityProvider>
              </AuthProvider>
            </DemoProvider>
          </VisualPreferencesProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
